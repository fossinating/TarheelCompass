import { getUser } from "@/server/functions/user";
import { Schedule } from "./systemSlice"

export interface UserData { 
  schedules: Array<Schedule>
}

export const fetchUserData = async (): Promise<UserData> => {
  // TODO: add error handling
  return await getUser();
}