import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView } from 'react-native';
import Header from '../screens/Header'; // Assurez-vous du bon chemin
import BottomTabNavigator from '../screens/BottomNavigator'; // Assurez-vous du bon chemin

const UnderConstructionPage = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header />

      {/* Contenu principal */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.mainContent}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }} // Remplacez l'URL par l'image de votre choix
            style={styles.image}
          />
          <Text style={styles.title}>Page en construction</Text>
          <Text style={styles.message}>Cette page est actuellement en cours de construction. Revenez plus tard !</Text>
        </View>
      </ScrollView>

      {/* BottomTabNavigator */}
      <BottomTabNavigator />
    </SafeAreaView>
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

