"use server";

import { db } from '@/server/db';
import { auth } from '@/server/auth';
import { eq, and } from 'drizzle-orm';
import { scheduledClassTable, scheduleTable } from "@/server/db/schema";

export const addClassRemote = async (scheduleID: string, classNumber: number) => {
    'use server';

    const session = await auth()
    if (session && session?.user) {    
        const schedule = await db.query.scheduleTable.findFirst({
            where: (scheduleTable, {eq}) => and(eq(scheduleTable.id, scheduleID), eq(scheduleTable.ownerID, session.user.id as string))
        })

        if (schedule == null) {
            throw new Error("Could not find the requested schedule. Either it doesn't exist on the server or your user does not have access to modifying it.");
        }

        const addClass = await db.insert(scheduledClassTable).values({
            scheduleID: scheduleID,
            classNumber: classNumber
        })
        
        if (addClass === null) {
            throw new Error("Could not add class to schedule. Please try again later.");
        }

        return { success: true, message: "Successfully added class to schedule."}
    } else {
        // Not Signed in
        throw new Error("You must be logged in to do that.");
    }
};

export const removeClassRemote = async (scheduleID: string, classNumber: number) => {
    "use server";
    const session = await auth()
    if (session && session?.user) {
        const schedule = await db.query.scheduleTable.findFirst({
           // where: (schedules, {eq, and}) => and(eq(schedules.id, data.scheduleID), eq(schedules.ownerID, session.user.id))
            where: (scheduleTable, {eq, and}) => and(eq(scheduleTable.id, scheduleID))
        })

        if (schedule == null) {
            throw new Error("Could not find the requested schedule. Either it doesn't exist on the server or your user does not have access to modifying it.");
        }

        const removeClass = await db.delete(scheduledClassTable).where(and(eq(scheduledClassTable.classNumber, classNumber), eq(scheduledClassTable.scheduleID, scheduleID)))

        if (removeClass === null) {
            throw new Error("Could not remove class from schedule. Please try again later.");
        }

        return { success: true, message: "Successfully removed class from schedule."};
    } else {
        // Not Signed in
        throw new Error("You must be logged in to do that");
    }
}

export const createScheduleRemote = async (id: string, name: string, term: string) => {
    "use server";
    const session = await auth()
    if (session && session?.user) {
        if (id.length != 36) {
            throw new Error("Invalid schedule id. Please don't try manipulating this api outside of normal use of the program.");
        }

        if (session.user.id == null) {
            throw new Error("User ID was null. Please report this issue.");
        }

        const checkSchedule = await db.query.scheduleTable.findFirst({
            where: (scheduleTable, {eq}) => eq(scheduleTable.id, id)
        })

        if (checkSchedule != null) {
            throw new Error("This schedule ID is already taken. Please try again.");
        }

        const createSchedule = await db.insert(scheduleTable).values({
            id: id,
            name: name,
            term: term,
            ownerID: session.user.id as string
        })
        
        if (createSchedule === null) {
            throw new Error("Could not create schedule. Please try again later.");
        }

        return {id: id, name: name, term: term};
    } else {
        // Not Signed in
        throw new Error("You must be logged in to do that.");
    }
}

export const deleteScheduleRemote = async (id: string) => {
    const session = await auth()
    if (session && session?.user) {
        if (session.user.id == null) {
            throw new Error("User ID was null. Please report this issue.");
        }

        const deleteSchedule = await db.delete(scheduleTable).where(and(eq(scheduleTable.id, id), eq(scheduleTable.ownerID, session.user.id)))

        if (deleteSchedule != null) {
            throw new Error("Could not find the requested schedule. Either it doesn't exist on the server or your user does not have access to modifying it.");
        }

        return id;
    } else {
        // Not Signed in
        throw new Error("You must be logged in to do that.");
    }
}

export const renameScheduleRemote = async (id: string, newName: string) => {
    const session = await auth()
    if (session && session?.user) {

        if (session.user.id == null) {
            throw new Error("User ID was null. Please report this issue.");
        }

        const updateSchedule = await db.update(scheduleTable).set({name: newName}).where(and(eq(scheduleTable.id, id), eq(scheduleTable.ownerID, session.user.id)))

        if (updateSchedule != null) {
            throw new Error("Could not find the requested schedule. Either it doesn't exist on the server or your user does not have access to modifying it.");
        }

        return newName;
    } else {
        // Not Signed in
        throw new Error("You must be logged in to do that.");
    }
}