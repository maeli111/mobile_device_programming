import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../screens/Header'; // Assurez-vous que le fichier header.tsx est bien situé dans le bon répertoire
import BottomTabNavigator from '../screens/BottomNavigator'; // Assurez-vous que le fichier bottomNavigator.tsx est bien situé dans le bon répertoire

export default function DeleteActivity() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supprimer une activité</Text>
      {/* Ajouter ici les composants et le formulaire pour supprimer une activité */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
});
