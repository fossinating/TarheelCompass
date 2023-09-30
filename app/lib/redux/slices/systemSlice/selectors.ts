/* Instruments */
import type { ReduxState } from '@/lib/redux'

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectSchedules = (state: ReduxState) => state.system.schedules
export const selectCurrentScheduleIndex = (state: ReduxState) => state.system.currentScheduleIndex
export const selectSystem = (state: ReduxState) => state.system