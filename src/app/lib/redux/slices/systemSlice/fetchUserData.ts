import { Schedule } from "./systemSlice"

export interface UserData { 
  schedules: Array<Schedule>
}

export const fetchUserData = async (): Promise<UserData> => {
    const response = await fetch('http://localhost:3000/api/user', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    const result: UserData = await response.json()
  
    return result
  }