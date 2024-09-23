/* Core */
import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { getSession } from 'next-auth/react';
import { createLogger } from 'redux-logger';
import { ReduxState } from '.';
import { addClass, changeCurrentSchedule, createSchedule, deleteSchedule, removeClass, renameSchedule } from './slices/systemSlice';
import { addClassRemote, createScheduleRemote, deleteScheduleRemote, removeClassRemote, renameScheduleRemote } from '@/server/functions/schedules';
import ReactGA from "react-ga4";

/*const SYNC_LOCALSTORAGE: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type === 'system/changeCurrentSchedule') {
    if (localStorage.getItem('current_schedule') !== action.payload) {
      localStorage.setItem('current_schedule', action.payload);
    }
  } else if (action.type === 'system/createSchedule' || action.type === "system/addClass" || action.type === "system/removeClass" || action.type === "system/removeSchedule") {
    localStorage.setItem("schedules", JSON.stringify(store.getState().schedule))
    //let schedulesString = localStorage.getItem("schedules")
    //localStorage.setItem("schedules", JSON.stringify([...(schedulesString != null ? JSON.parse(schedulesString): []), {...action.payload, class_numbers: []}]))
  }/* else if (action.type === "system/addClass") {
    let schedulesString = localStorage.getItem("schedules")
    let currentScheduleIndexString = localStorage.getItem("current_schedule")
    if (schedulesString == null || currentScheduleIndexString == null) {
      throw new Error("User tried adding a class when schedule was not saved, is there an issue with localStorage?");
    }
    let schedules = JSON.parse(schedulesString);
    let currentScheduleIndex = JSON.parse(currentScheduleIndexString) as number
    let current_schedule = schedules[currentScheduleIndex]
    localStorage.setItem("schedules", JSON.stringify([
      ...(schedules.filter((_: Schedule, index: number) => {index != currentScheduleIndex})),
      {...current_schedule, class_numbers: [...current_schedule.class_numbers, action.payload]}
    ]))
  } else if (action.type === "system/removeClass") {

  }
  return next(action);
}*/

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(addClass, removeClass, createSchedule, deleteSchedule, renameSchedule),
  effect: (action, listenerAPI) => {
    localStorage.setItem(
      "schedules",
      JSON.stringify((listenerAPI.getState() as ReduxState).system.schedules)
    )
  }
})

listenerMiddleware.startListening({
  actionCreator: changeCurrentSchedule,
  effect: (action, listenerApi) => {
    localStorage.setItem(
      "currentScheduleIndex",
      JSON.stringify((listenerApi.getState() as ReduxState).system.currentScheduleIndex)
    )
  }
})

const requestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

/*
      Middleware for logged in users, sending mutations to the server
*/

listenerMiddleware.startListening({
  actionCreator: addClass,
  effect: async (action, listenerAPI) => {
    const session = await getSession();
    if (session !== null) {
      try {
        const response = await addClassRemote(action.payload.scheduleID, action.payload.classNumber);
      } catch (error: any) {
        console.error("An error occured while adding class to schedule: " + error);
      }
    }
    ReactGA.event("addClass", {
      classNumber: action.payload.classNumber,
      loggedIn: session !== null,
    })
  }
})

listenerMiddleware.startListening({
  actionCreator: removeClass,
  effect: async (action, listenerAPI) => {
    const session = await getSession();
    if (session !== null) {
      try {
        const response = await removeClassRemote(action.payload.scheduleID, action.payload.classNumber);
      } catch (error: any) {
        console.error("An error occured while removing class from schedule: " + error);
      }
    }
    ReactGA.event("removeClass", {
      classNumber: action.payload.classNumber,
      loggedIn: session !== null,
    })
  }
})

listenerMiddleware.startListening({
  actionCreator: createSchedule,
  effect: async (action, listenerAPI) => {
    const session = await getSession();
    console.log(session);
    if (session !== null) {
      try {
        const response = await createScheduleRemote(action.payload.id, action.payload.name, action.payload.term);
      } catch (error: any) {
        console.error("An error occured while creating schedule: " + error);
      }
    }
    ReactGA.event("createSchedule", {
      loggedIn: session !== null,
    })
  }
})

listenerMiddleware.startListening({
  actionCreator: deleteSchedule,
  effect: async (action, listenerAPI) => {
    const session = await getSession();
    if (session !== null) {
      try {
        const response = await deleteScheduleRemote(action.payload.id);
      } catch (error: any) {
        console.error("An error occured while deleting schedule: " + error);
      }
    }
    ReactGA.event("deleteSchedule", {
      loggedIn: session !== null,
    })
  }
})

listenerMiddleware.startListening({
  actionCreator: renameSchedule,
  effect: async (action, listenerAPI) => {
    const session = await getSession();
    if (session !== null) {
      try {
        const response = await renameScheduleRemote(action.payload.id, action.payload.newName);
      } catch (error: any) {
        console.error("An error occured while renaming schedule: " + error);
      }
    }
    ReactGA.event("renameSchedule", {
      loggedIn: session !== null,
    })
  }
})

const middleware = [
  createLogger({
    duration: true,
    timestamp: false,
    collapsed: true,
    colors: {
      title: () => '#139BFE',
      prevState: () => '#1C5FAF',
      action: () => '#149945',
      nextState: () => '#A47104',
      error: () => '#ff0005',
    },
    predicate: () => typeof window !== 'undefined',
  })
]

export { middleware, listenerMiddleware };

