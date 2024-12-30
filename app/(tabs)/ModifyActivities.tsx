import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router'; // Utilisation du routeur d'Expo
import { Ionicons } from '@expo/vector-icons'; // Importation des icônes
import Header from '../screens/Header'; // Assurez-vous que le fichier header.tsx est bien situé dans le bon répertoire
import BottomTabNavigator from '../screens/BottomNavigator'; // Assurez-vous que le fichier bottomNavigator.tsx est bien situé dans le bon répertoire

export default function MainPage() {
  const router = useRouter();

  // Fonction pour rediriger vers la page d'ajout d'activité
  const goToAddActivity = () => {
    router.push('/AddActivity');
  };

  // Fonction pour rediriger vers la page de suppression d'activité
  const goToDeleteActivity = () => {
    router.push('/DeleteActivity');
  };

  return (
    <View style={styles.container}>
      <Header />  

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Que souhaitez-vous faire ?</Text>

        {/* Boutons stylisés avec des icônes et des effets de survol */}
        <TouchableOpacity style={styles.button} onPress={goToAddActivity}>
          <Ionicons name="add-circle-outline" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Ajouter une activité</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={goToDeleteActivity}>
          <Ionicons name="remove-circle-outline" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Supprimer une activité</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomTabNavigator /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEDB9B', // Couleur de fond avec un beige doux
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20, // Espace en haut pour séparer le header du contenu
    paddingBottom: 70, // Espace en bas avant le BottomTabNavigator
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#B53302', // Titre en rouge chaud
  },
  button: {
    backgroundColor: '#FCAC23', // Bouton avec un jaune doré
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    maxWidth: 350, // Limiter la largeur du bouton
    justifyContent: 'center',
    shadowColor: '#000', // Ombre pour effet 3D
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3, // Pour l'effet ombre sur Android
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
});
