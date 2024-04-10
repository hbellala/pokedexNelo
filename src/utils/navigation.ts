import { NavigationProp, RouteProp } from '@react-navigation/native';

export type ScreenNames = ["Home", "Detail"]
export type RootStackParamList = {
  Home: undefined;
  Detail: { pokemonId: string, pokemonName: string };
};
export type StackNavigation = NavigationProp<RootStackParamList>;

export type RootRouteProps<RouteName extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  RouteName
>;
