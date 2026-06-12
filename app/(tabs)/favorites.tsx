import { View, Text, FlatList } from 'react-native'
import MealCard from '@/components/mealCard'
import { useAppSelector } from '@/store/hook'
import { Meal } from '@/interfaces/meal'
import { ActivityIndicator } from 'react-native-paper'

export default function FavoriteScreen () {
  const { meals, _persist } = useAppSelector((s) => s.favorites)

  return (

    <View className="h-screen py-10">
      <Text className={'text-white text-center text-xl'}>Favorite</Text>
      {!_persist.rehydrated && (
        <ActivityIndicator animating={true}/>
      )}
      {_persist.rehydrated && (
        <FlatList<Meal>
          className="flex-1"
          contentContainerStyle={{ padding: 16 }}
          data={meals}
          renderItem={({ item }) => <MealCard meal={item}/>}
          keyExtractor={(item) => item.idMeal.toString()}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center pt-20">
              <Text className="text-white text-base">Aucune donnée trouvée</Text>
            </View>
          }
        />)}
    </View>
  )
}