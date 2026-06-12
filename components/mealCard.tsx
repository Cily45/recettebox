import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Meal } from '@/interfaces/meal'
import { useRouter } from 'expo-router'
import { IconButton } from 'react-native-paper'
import { addItemFavorite, removeItemFavorite } from '@/components/favoriteSlice'
import { useAppDispatch, useAppSelector } from '@/store/hook'

export default function MealCard (props: { meal: Meal, isFavorite?: boolean, category?: string }) {
  const router = useRouter()
  const favoritesMeals = useAppSelector((s) => s.favorites.meals)
  const [isInFavorites, setIsInFavorites] = useState<boolean>(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (props.meal && favoritesMeals) {
      setIsInFavorites(!!favoritesMeals.find(m => m.idMeal === props.meal.idMeal))
    }
  }, [props, favoritesMeals])

  return (
    <TouchableOpacity
      className="bg-neutral-800 rounded-2xl overflow-hidden shadow-lg w-full my-2"
      onPress={() => {
        router.push(`/${props.meal.idMeal}`)
      }}
    >
      <View className="absolute z-50 right-0">
        {props.isFavorite &&
          (<IconButton icon={'close'}
                       mode={'contained-tonal'}
                       onPress={() => dispatch(removeItemFavorite(props.meal.idMeal))}/>
          )}
      </View>

      <Image
        source={{ uri: props.meal.strMealThumb }}
        className="h-48"
        resizeMode="cover"
      />

      <View className="p-4">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-white text-xl font-bold truncate">
            {props.meal.strMeal}
          </Text>
          {isInFavorites && (
            <IconButton icon="heart"
                        onPress={() => dispatch(removeItemFavorite(props.meal?.idMeal))}/>)
          }
          {!isInFavorites && (
            <IconButton icon="heart-outline"
                        onPress={() => dispatch(addItemFavorite(props.meal))}/>)
          }
        </View>
        <View className="mt-2 flex-row items-center">
          <View className="bg-orange-500 px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-semibold uppercase">
              {props.category ? props.category : props.meal.strCategory}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}