import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useGetMealByIdQuery } from '@/service/api'
import { Meal } from '@/interfaces/meal'
import { IconButton, Snackbar } from 'react-native-paper'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { addItemFavorite, removeItemFavorite } from '@/components/favoriteSlice'
import { useEffect, useState } from 'react'
import YoutubePlayer from 'react-native-youtube-iframe'

export default function MealScreen () {
  const { id } = useLocalSearchParams<{ id: string }>()
  const favoritesMeals = useAppSelector((s) => s.favorites.meals)
  const [isInFavorites, setIsInFavorites] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const [visible, setVisible] = useState(false)
  const onDismissSnackBar = () => setVisible(false)
  const { data, isError, isLoading } = useGetMealByIdQuery(id as string, {
    skip: !id
  })
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (isError) {
      setVisible(true)
    }
  }, [isError])

  const [meal, setMeal] = useState<Meal>()

  useEffect(() => {
    if (typeof data?.meals !== 'string') {
      setMeal(data?.meals[0])
    }
  }, [data])

  useEffect(() => {
    if (meal && favoritesMeals) {
      setIsInFavorites(!!favoritesMeals.find(m => m.idMeal === meal.idMeal))
    }
  }, [meal, favoritesMeals])

  function getIngredients (currentMeal: Meal) {
    const ingredients = []

    for (let i = 1; i <= 20; i++) {
      const ingredientKey = `strIngredient${i}` as keyof Meal
      const measureKey = `strMeasure${i}` as keyof Meal

      const ingredient = currentMeal[ingredientKey] as string | undefined | null
      const measure = currentMeal[measureKey] as string | undefined | null

      if (ingredient && ingredient.trim() !== '') {
        ingredients.push({
          id: i.toString(),
          name: ingredient,
          measure: measure || ''
        })
      }
    }
    return ingredients
  }

  if (isLoading) {
    return (
      <View className="flex-1 bg-neutral-900 justify-center items-center">
        <ActivityIndicator size="large" color="#f97316"/>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-neutral-900">
      <View className={'absolute top-0 left-0 z-50'}>
        <IconButton
          mode={'contained-tonal'}
          icon={'arrow-left-bold'}
          onPress={() => {
            router.back()
          }
          }/>
      </View>
      {!isLoading && meal &&
        (<ScrollView className="flex-1">
            <Image
              source={{ uri: meal.strMealThumb }}
              className="w-full h-72 rounded-b-3xl"
              resizeMode="cover"
            />

            <View className="p-5">
              <View className={'flex flex-row flex-wrap items-center mb-3'}>
                <Text className="text-white text-3xl font-bold ">
                  {meal.strMeal}
                </Text>
                {isInFavorites && (
                  <IconButton icon="heart"
                              onPress={() => dispatch(removeItemFavorite(meal?.idMeal))}/>)
                }
                {!isInFavorites && (
                  <IconButton icon="heart-outline"
                              onPress={() => dispatch(addItemFavorite(meal))}/>)
                }
              </View>
              <View className="flex-row gap-3 mb-8">
                {meal.strCategory &&
                  (<View className="bg-orange-500 px-4 py-1.5 rounded-full">
                    <Text className="text-white font-semibold">{meal.strCategory}</Text>
                  </View>)}

                {meal.strArea && (<View className="bg-neutral-700 px-4 py-1.5 rounded-full">
                  <Text className="text-gray-300">{meal.strArea}</Text>
                </View>)}
              </View>

              <Text className="text-white text-2xl font-bold mb-4">Ingrédients</Text>
              <View className="mb-8">
                {getIngredients(meal).map((item) => (
                  <Text key={item.id} className="text-neutral-300 text-base mb-1">
                    • {item.name} : {item.measure}
                  </Text>
                ))}
              </View>

              <Text className="text-white text-2xl font-bold mb-4">Instructions</Text>
              <Text className="text-neutral-300 text-base leading-relaxed tracking-wide pb-10">
                {meal.strInstructions}
              </Text>
              <Text className="text-neutral-300 text-base leading-relaxed tracking-wide pb-10">
                {meal.strYoutube}
              </Text>
              <YoutubePlayer
                height={300}
                play={playing}
                videoId={meal.strYoutube.replace('https://www.youtube.com/watch?v=', '')}
                onChangeState={(state: any) => {
                  if (state === 'ended') {
                    setPlaying(false)
                  }
                }}
              />
            </View>
          </ScrollView>
        )}
      {isLoading && (
        <ActivityIndicator className={'h-full'} animating={true}/>
      )}

      <Snackbar
        visible={visible}
        className={'mb-16 !bg-red-500 '}
        onDismiss={onDismissSnackBar}
        duration={3000}
      >
        <Text className={'text-white'}>Il y a eu une erreur</Text>
      </Snackbar>
    </View>
  )
}