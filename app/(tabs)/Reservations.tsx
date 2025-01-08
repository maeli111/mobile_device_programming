import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { app } from '../../firebaseConfig'; // Assurez-vous que le chemin est correct
import { useRouter } from 'expo-router'; // Pour la navigation
import Header from '../screens/Header';
import BottomTabNavigator from '../screens/BottomNavigator';

const UnderConstructionPage = () => {
  const auth = getAuth(app);
  const router = useRouter();

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      // Si aucun utilisateur n'est connecté
      Alert.alert(
        "Error",
        "You must be logged in to access this page.",
        [
          { 
            text: "OK", 
            onPress: () => router.push('/LoginScreen') 
          }
        ]
      );
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />

      <SafeAreaView style={styles.container}>
        {/* Contenu principal */}
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.mainContent}>
            <Text style={styles.title}>Page in construction</Text>
            <Text style={styles.message}>
              This page is currently under construction. Check back later!
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
      
      {/* BottomTabNavigator */}
      <BottomTabNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60, // Espacement pour éviter que le contenu touche le bas
  },
  mainContent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B53302',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginTop: 10,
  },
});

export default UnderConstructionPage;
