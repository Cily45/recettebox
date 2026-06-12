import { View, Text, FlatList, TouchableOpacity } from 'react-native'

import MealCard from '@/components/mealCard'
import { useEffect, useState } from 'react'
import { TextInput, Chip, IconButton, Icon } from 'react-native-paper'
import { Meal } from '@/interfaces/meal'
import { useGetByCategoryQuery, useGetCategoriesQuery, useGetProduitsQuery } from '@/service/api'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { addSearch } from '@/components/searchesSlice'

export default function SearchScreen () {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)
  const categories = useGetCategoriesQuery()
  const resByCat = useGetByCategoryQuery(selectedCategory ?? '', { skip: !selectedCategory })
  const resBySearch = useGetProduitsQuery(search, { skip: !!selectedCategory })

  const [meals, setMeals] = useState<Meal[]>([])
  const isLoading = categories.isLoading || []//currentQuery.isLoading
  const searches = useAppSelector((s) => s.searches)
  const dispatch = useAppDispatch()
  const [isSearchOpen, setSearchOpen] = useState(false)
  const [isCateroriesOpen, setIsCateroriesOpen] = useState(false)

  useEffect(() => {
    const currentData = selectedCategory ? resByCat.data : resBySearch.data
    if (currentData?.meals) {
      setMeals(currentData.meals)
    }
  }, [resBySearch, resByCat, selectedCategory])

  function handleSearchSubmit () {
    if (selectedCategory) {
      setSelectedCategory(undefined)
    }
    dispatch(addSearch({ name: search, meals: meals }))
    setSearchOpen(false)
  }

  function handleHistorySelect (name: string) {
    setSelectedCategory(undefined)
    setSearch(name)
    setSearchOpen(false)
  }

  return (
    <View className="h-screen py-10">
      <TouchableOpacity onPress={() => {
        setSearchOpen(true)
      }}
      >
        <TextInput
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearchSubmit}
          readOnly={!isSearchOpen}
        />
        {isSearchOpen && (
          <View className={'absolute right-0'}>
            <IconButton icon={'close'} onPress={() => setSearchOpen(false)}/>
          </View>
        )}
      </TouchableOpacity>

      {isSearchOpen && (
        <View className="bg-neutral-800 rounded-b-md z-50 p-2 pb-24 shadow-lg">
          <FlatList
            data={[...searches.searches].reverse()}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex-row items-center py-3 px-2 border-b border-neutral-700 gap-3"
                onPress={() => handleHistorySelect(item.name)}
              >
                <Icon source="history" size={20} color="#ccc"/>
                <Text className="text-white text-base">{item.name.toString()}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {!isSearchOpen && (
        <>
          <TouchableOpacity className={'bg-slate-800 flex flex-row justify-between py-4 px-8'}
                            onPress={() => setIsCateroriesOpen(!isCateroriesOpen)}>
            <Text
              className={'text-white'}>Categories</Text>
            <Icon source={isCateroriesOpen ? 'chevron-down' : 'chevron-up'} size={20}/>
          </TouchableOpacity>
          {isCateroriesOpen && (
            <View className={'flex flex-wrap flex-row gap-2 justify-center p-4 bg-slate-400'}>
              {categories.data?.meals?.map((cat) => {
                const isSelected = selectedCategory === cat.strCategory
                return (
                  <Chip
                    className="w-fit"
                    key={cat.strCategory}
                    onPress={() => {
                      if (isSelected) {
                        setSelectedCategory(undefined)
                        setSearch('')
                      } else {
                        setSelectedCategory(cat.strCategory)
                        setSearch(cat.strCategory)
                      }
                    }}
                    selected={isSelected}
                  >{cat.strCategory}</Chip>
                )
              })}
            </View>
          )}

          <FlatList
            className="flex-1"
            contentContainerStyle={{ padding: 16 }}
            data={meals}
            renderItem={({ item }) => <MealCard meal={item} category={selectedCategory}/>}
            keyExtractor={(item) => item.idMeal.toString()}
            ListEmptyComponent={!isLoading ? (
              <View className="flex-1 justify-center items-center pt-20">
                <Text className="text-white text-base">Aucune donnée trouvée</Text>
              </View>
            ) : null}/></>
      )}
    </View>
  )
}