import { configureStore } from '@reduxjs/toolkit'
import { api } from '@/service/api'
import favoriteReducer from '../components/favoriteSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistReducer, persistStore } from 'redux-persist'
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist/es/constants'
import searchesSlice from '../components/searchesSlice'

const favoritePersistConfig = { key: 'favorite', storage: AsyncStorage }
const searchesPersistConfig = { key: 'searches', storage: AsyncStorage }

const persistedFavoriteReducer = persistReducer(favoritePersistConfig, favoriteReducer)
const persistedSearchesReducer = persistReducer(searchesPersistConfig, searchesSlice)
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    favorites: persistedFavoriteReducer,
    searches: persistedSearchesReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(api.middleware)
})
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
