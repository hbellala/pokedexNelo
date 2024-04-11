import React, {useState, useMemo} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Card, TextInput, Text} from 'react-native-paper';
import {useInfiniteQuery} from '@tanstack/react-query';
import {Pokemon} from '../utils/types';
import {StackNavigation} from '../utils/navigation';
import {fetchPokemon} from '../services';

function HomeScreen() {
  const navigation = useNavigation<StackNavigation>();
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const {data, error, isPending, isError, fetchNextPage, hasNextPage} =
    useInfiniteQuery({
      queryKey: ['load-pokemons'],
      initialPageParam: 1,
      queryFn: ({pageParam}) => fetchPokemon(pageParam),
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length ? allPages.length + 1 : undefined;
      },
    });

  const pokemon = useMemo(() => {
    return data?.pages.reduce((acc, page) => {
      return [...acc, ...page];
    }, []);
  }, [data]);

  const Item = ({item}: {item: Pokemon}) => {
    const pokemonId = item.url.split('/')[item.url.split('/').length - 2];
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Pressable
            style={styles.item}
            onPress={() =>
              navigation.navigate('Detail', {
                pokemonId,
                pokemonName: item.name.toLocaleUpperCase(),
              })
            }>
            <Image
              style={{width: 80, height: 80, marginRight: 12}}
              source={{
                uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,
              }}
            />
            <View style={{flex: 1}}>
              <Text style={styles.pokemonName} variant="titleMedium">
                {item.name}
              </Text>
              <Text variant="labelMedium">N˚{pokemonId}</Text>
            </View>
          </Pressable>
        </Card.Content>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Pokedex</Text>
      {isPending ? (
        <ActivityIndicator style={{marginVertical: 20}} size={'large'} />
      ) : isError ? (
        <Text>Error: {error.message}</Text>
      ) : (
        <>
          <TextInput
            onChangeText={setSearchKeyword}
            value={searchKeyword}
            placeholder="Search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <FlatList
            data={
              pokemon.filter((p: Pokemon) =>
                p.name.includes(searchKeyword),
              ) as Pokemon[]
            }
            renderItem={({item}: {item: Pokemon}) => <Item item={item} />}
            keyExtractor={item => item.name}
            onEndReached={() =>
              !searchKeyword && hasNextPage && fetchNextPage()
            }
            // onEndReachedThreshold={0.8}
            ListFooterComponent={
              !searchKeyword && hasNextPage ? (
                <ActivityIndicator size={'small'} />
              ) : null
            }
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 32,
  },
  card: {
    marginTop: 10,
    marginHorizontal: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pokemonName: {
    textTransform: 'capitalize',
    marginBottom: 5,
  },
});

export default HomeScreen;
