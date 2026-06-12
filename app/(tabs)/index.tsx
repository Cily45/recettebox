import { View, Text, ActivityIndicator } from 'react-native'

import MealCard from '@/components/mealCard'
import { useGetRandomMealQuery } from '@/service/api'
import { Button, Snackbar } from 'react-native-paper'
import { useEffect, useState } from 'react'

export default function HomeScreen () {
  const { data, isLoading, isError, refetch } = useGetRandomMealQuery()
  const [visible, setVisible] = useState(false)
  const onDismissSnackBar = () => setVisible(false)

  useEffect(() => {
    if (isError) {
      setVisible(true)
    }
  }, [isError])
  return (
    <View className="h-screen py-20 px-4 flex justify-around items-center">
      <Text className={'text-xl font-bold text-white'}>Accueil</Text>
      {!isLoading && data?.meals[0] && (
        <><MealCard meal={data?.meals[0]!}></MealCard><Button
          icon={'dice-multiple-outline'}
          mode={'contained'}
          onPress={() => {
            refetch()
          }}>Recette aléatoire</Button></>
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