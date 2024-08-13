"use server";

import { db } from '@/server/db';
import { scheduleTable, userTable } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { auth } from '../auth';

export const getUser = async () => {
  'use server';

  const session = await auth()
  if (session) {
    if (session.user.id == null) {
      throw new Error("User ID was null when trying to update user. Please report this issue.");
    }

    const userSchedules = await db.query.scheduleTable.findMany({
      where: eq(scheduleTable.ownerID, session.user.id),
      with: {
        classes: true
      }
    })


    // wtf does this even do
    let expanded = userSchedules.map((oldSchedule) => { return { ...oldSchedule, classNumbers: oldSchedule.classes.map((classObj) => classObj.classNumber) } })


    // or this
    let retract = expanded.map(({ classes, ...oldSchedule }) => oldSchedule)

    return {
      schedules: retract
    };
  } else {
    // Not Signed in
    throw new Error("You must be logged in to do that");
  }
};

export const changeUsername = async (newUsername: string) => {
  "use server";

  const session = await auth()
  if (session && session?.user && session.user?.email) {
    if (newUsername && newUsername.length > 2 && newUsername.length <= 20 && newUsername.match("^[a-z0-9][a-z0-9\_.\-]+[a-z0-9]$") !== null) {

      const currentUser = await db.query.userTable.findFirst({
        where: (userTable, { eq }) => eq(userTable.name, newUsername)
      })

      if (currentUser !== null) {
        throw new Error("Username is unavailable. Try adding numbers, letters, underscores _ , or periods.");
      }

      const updateUser = await db.update(userTable).set({ name: newUsername }).where(eq(userTable.email, session.user.email))

      if (updateUser === null) {
        throw new Error("Could not update your username. Please try again later.");
      }

      console.log(updateUser);

      return newUsername;
    } else {
      throw new Error("Invalid username. Username must be 3-20 characters, characters a-Z, 0-9, `.`, `-`, or `_`, and must start and end with a-Z or 0-9.");
    }
  } else {
    // Not Signed in
    throw new Error("You must be logged in to do that");
  }
}