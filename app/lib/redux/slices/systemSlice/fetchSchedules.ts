import { Schedule } from "./systemSlice"

export const fetchSchedules = async (): Promise<{ data: Array<Schedule> }> => {
    const response = await fetch('http://localhost:3000/api/schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    const result = await response.json()
  
    return result
  }