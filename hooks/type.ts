import { StackNavigationProp } from '@react-navigation/stack';

// Déclare ton type de navigation
export type RootStackParamList = {
  Connexion: undefined;
  MainScreen: undefined;
  // Ajoute d'autres écrans si nécessaire
};

export type MainScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MainScreen'
>;
