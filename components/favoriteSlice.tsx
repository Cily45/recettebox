import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Meal } from '@/interfaces/meal'

interface FavoriteState {
  meals: Meal[];
}

const initialState: FavoriteState = { meals: [] }

const favoriteSlice = createSlice({
  name: 'meals',
  initialState,
  reducers: {
    addItemFavorite: (state, action: PayloadAction<Meal>) => {
      if (!state.meals.find((item) => item.idMeal === action.payload.idMeal)) {
        state.meals.push({ ...action.payload })
      }
    },
    removeItemFavorite: (state, action: PayloadAction<number>) => {
      state.meals = state.meals.filter((i) => i.idMeal !== action.payload)
    }
  }
})
export const { addItemFavorite, removeItemFavorite } = favoriteSlice.actions
export default favoriteSlice.reducer