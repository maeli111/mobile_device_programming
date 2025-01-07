import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Button, StyleSheet } from 'react-native';
import Header from '../screens/Header';
import BottomNavigator from '../screens/BottomNavigator';
import { useNavigation } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function ConnexionScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const auth = getAuth();

  const [user, setUser] = useState(null);

  // Cacher le header par défaut
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Vérifier l'état de l'utilisateur
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Nettoyage de l'écouteur
  }, [auth]);

  // Redirige vers la page de connexion
  const goToLogin = () => {
    router.push('/LoginScreen');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />

      {/* Contenu principal */}
      <View style={styles.content}>
        {user ? (
          <Text style={styles.title}>
            Bienvenue, {user.displayName || 'Utilisateur'} !
          </Text>
        ) : (
          <>
            <Text style={styles.title}>
              Pour profiter de toutes les fonctionnalités de l'application, veuillez vous connecter.
            </Text>
            <Button title="Se Connecter" onPress={goToLogin} />
          </>
        )}
      </View>

      {/* Bottom Navigator */}
      <BottomNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEDB9B',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FECA64',
    borderRadius: 20,
    margin: 10,
    shadowColor: '#B53302',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#B53302',
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
    color: '#E97D01',
  },
});
