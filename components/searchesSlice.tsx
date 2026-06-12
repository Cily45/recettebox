import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Meal } from '@/interfaces/meal'

interface Search {
  name: string
  meals: Meal[]
}

interface SearchesState {
  searches: Search[];
}

const initialState: SearchesState = { searches: [] }

const searchesSlice = createSlice({
  name: 'searches',
  initialState,
  reducers: {
    addSearch: (state, action: PayloadAction<Search>) => {
      if (state.searches.length > 4) {
        state.searches.shift()
      }
      state.searches.push({ ...action.payload })
    }
  }
})
export const { addSearch } = searchesSlice.actions
export default searchesSlice.reducer