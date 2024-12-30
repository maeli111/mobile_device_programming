import React, { useEffect } from 'react'; // ✅ Ajout de React et useEffect
import { useRouter } from 'expo-router';
import { View, Text, Button, StyleSheet } from 'react-native';
import Header from '../screens/Header'; // Import Header
import BottomNavigator from '../screens/BottomNavigator'; // Import BottomNavigator
import { useNavigation } from '@react-navigation/native';
 
export default function ConnexionScreen() {
  const router = useRouter(); // Pour gérer la navigation
  const navigation = useNavigation();

  // Définir un titre personnalisé
  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false, // Cache le header automatique
    });
  }, [navigation]);

  // Redirige vers la page d'inscription
  const booking = () => {
    router.push('/Booking');
  };
  
  // Redirige vers la page d'accueil
  const index = () => {
    router.push('/');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />

      {/* Contenu principal */}
      <View style={styles.content}>
        <Text style={styles.title}>Page de Connexion</Text>
        <Button title="Aller à Booking" onPress={booking} />
        <Button title="Aller à Accueil" onPress={index} />
      </View>

      {/* Bottom Navigator */}
      <BottomNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEDB9B', // Fond principal doux
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FECA64', // Fond secondaire
    borderRadius: 20,
    margin: 10,
    shadowColor: '#B53302',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#B53302', // Texte titre principal
    textAlign: 'center',
  },
  buttonContainer: {
    width: '80%',
    gap: 15,
  },
  button: {
    color: '#E97D01', // Couleur des boutons
  },
});