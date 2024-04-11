import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Card, Chip, Text} from 'react-native-paper';
import {StackNavigation, RootRouteProps} from '../utils/navigation';
import {fetchPokemonDetail} from '../services';
import {PokemonAbility, PokemonType} from '../utils/types';

function DetailScreen() {
  const navigation = useNavigation<StackNavigation>();
  const {pokemonId, pokemonName} = useRoute<RootRouteProps<'Detail'>>().params;

  const {data, error, isPending, isError} = useQuery({
    queryKey: [`pokemon-detail-${pokemonId}`],
    queryFn: () => fetchPokemonDetail(pokemonId),
  });

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.content}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text>Back</Text>
        </Pressable>
        <Text style={styles.title}>{pokemonName.toLocaleLowerCase()}</Text>
        {isPending ? (
          <ActivityIndicator style={{marginVertical: 20}} size={'large'} />
        ) : isError ? (
          <Text>Error: {error.message}</Text>
        ) : (
          <Card>
            <Card.Content>
              <Image
                style={{width: 100, height: 100, alignSelf: 'center'}}
                source={{
                  uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,
                }}
              />
              <Text style={styles.space}>Types</Text>
              <View style={{flexDirection: 'row'}}>
                {data.types.map((type: PokemonType, index: number) => (
                  <Chip key={index} style={styles.space}>
                    {type.type.name}
                  </Chip>
                ))}
              </View>
              <Text style={styles.space}>Abilities</Text>
              <View style={{flexDirection: 'row'}}>
                {data.abilities.map((type: PokemonAbility, index: number) => (
                  <Chip key={index} style={styles.space}>
                    {type.ability.name}
                  </Chip>
                ))}
              </View>
              <Text style={styles.space}>Height: {data.height}</Text>
              <Text style={styles.space}>Weight: {data.weight}</Text>
              <Text style={styles.space}>Species: {data.species.name}</Text>
            </Card.Content>
          </Card>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    textTransform: 'capitalize',
    fontSize: 32,
    marginBottom: 24,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  space: {
    margin: 5,
  },
});

export default DetailScreen;
