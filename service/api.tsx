import { createApi, fetchBaseQuery }
  from '@reduxjs/toolkit/query/react'
import { Data } from '@/interfaces/meal'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://www.themealdb.com/api/json/v1/1/'
  }),
  endpoints: (build) => ({
    getProduits: build.query<Data, string>({
      query: (query) => `search.php?s=${query}`
    }),
    getMealById: build.query<Data, string>({
      query: (id) => `lookup.php?i=${id}`
    }),
    getRandomMeal: build.query<Data, void>({
      query: () => 'random.php'
    }),
    getCategories: build.query<Data, void>({
      query: () => 'list.php?c=list'
    }),
    getByCategory: build.query<Data, string>({
      query: (query) => `filter.php?c=${query}`
    })
  })
})

export const {
  useGetProduitsQuery,
  useGetMealByIdQuery,
  useGetRandomMealQuery,
  useGetCategoriesQuery,
  useGetByCategoryQuery
} = api