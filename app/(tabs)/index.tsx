import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
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
        {/* Image */}
        <Image
          source={require('../../assets/images/hiking.png')} // Option 1 : image locale
          style={styles.image}
          resizeMode="contain" // Garde les proportions de l'image
        />

        <Text style={styles.title}>Welcome to NomadEscape!</Text>

        {/* Bouton pour aller à la page de connexion */}
        <View style={styles.buttonContainer}>
          <Button
            title="Sign-In"
            onPress={goToLogin}
            color="#B53302" // Couleur du bouton
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
    marginVertical: 20,
    color: '#B53302', // Texte titre principal
    textAlign: 'center',
  },
  buttonContainer: {
    width: '80%',
    marginTop: 20,
  },
  image: {
    width: '80%', // Largeur de l'image (80% de l'écran)
    height: 200,  // Hauteur de l'image
    marginBottom: 20, // Espacement avec le titre
  },
});
