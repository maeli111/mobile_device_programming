import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Button, StyleSheet } from 'react-native';
import Header from '../screens/Header';
import BottomNavigator from '../screens/BottomNavigator';
import { useNavigation } from '@react-navigation/native';

export default function ConnexionScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  // Définir un titre personnalisé et cacher le header par défaut
  useEffect(() => {
    navigation.setOptions({
      headerShown: false, // Cache le header automatique
    });
  }, [navigation]);

  // Fonction pour rediriger vers la page de Booking
  const goToBooking = () => {
    router.push('/Booking');
  };

  // Fonction pour rediriger vers la page de connexion
  const goToLogin = () => {
    router.push('/LoginScreen');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />

      {/* Contenu principal */}
      <View style={styles.content}>
        <Text style={styles.title}>Page de Connexion</Text>

        <View style={styles.buttonContainer}>
          {/* Bouton pour aller à la page de réservation */}
          <Button
            title="Aller à la réservation"
            onPress={goToBooking}
            color="#E97D01" // Couleur bouton réservation
          />

          {/* Bouton pour aller à la page de connexion */}
          <Button
            title="Aller à la connexion"
            onPress={goToLogin}
            color="#B53302" // Couleur bouton connexion
          />
        </View>
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
});
