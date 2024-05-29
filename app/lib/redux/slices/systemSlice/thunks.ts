/* Instruments */
import { TermData } from '@/lib/Common'
import { createAppAsyncThunk } from '@/lib/redux/createAppAsyncThunk'
import { fetchUserData } from './fetchUserData'

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const updateUserData = createAppAsyncThunk(
  'system/updateUser',
  async () => {
    const response = await fetchUserData()

    

    // The value we return becomes the `fulfilled` action payload
    return response
  }
)

export const updateTerms = createAppAsyncThunk(
  'system/updateTerms',
  async () => {
    let res = await fetch(process.env.NEXT_PUBLIC_API_PATH + "/terms", {
        method: "GET",
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        }
      })

    let data: {terms: Array<TermData>, defaultTerm: string | undefined} = {terms: await res.json(), defaultTerm: undefined};

    data.terms.forEach(term => {
      if (term.default === true) {
        data.defaultTerm = term.id;
        return data;
      }
    });

    data.defaultTerm = data.terms[0].id

    // The value we return becomes the `fulfilled` action payload
    return data
  }
)