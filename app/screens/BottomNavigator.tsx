import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'; // Assurez-vous d'avoir installé @expo/vector-icons
import { useRouter } from 'expo-router';  // Utilisation de router pour la navigation

const BottomNavigator = () => {
  const router = useRouter(); // Gestion de la navigation
  
  // Fonction pour naviguer vers Home
  const navigateToHome = () => {
    router.push('/');
  };

  // Fonction pour naviguer vers map
  const navigateToMap = () => {
    router.push('/Map');
  };

  // Fonction pour naviguer vers search
  const navigateToSearch = () => {
    router.push('/Search');
  };
  
  // Fonction pour naviguer vers booking activities
  const navigateToBooking = () => {
    router.push('/Booking'); // Renommé pour plus de clarté
  };

  return (
    <View style={styles.bottomContainer}>
      <TouchableOpacity onPress={navigateToHome} style={styles.button}>
        <FontAwesome5 name="home" size={24} color="#FECA64" />
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToMap} style={styles.button}>
        <Ionicons name="map" size={24} color="#FECA64" />
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToSearch} style={styles.button}>
        <FontAwesome5 name="search" size={24} color="#FECA64" />
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToBooking} style={styles.button}>
        <Ionicons name="calendar" size={24} color="#FECA64" /> 
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#B53302', // Fond rouge intense
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#E97D01', // Bordure orange vif
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    position : 'absolute',
    bottom : 0,
  },
  button: {
    flex: 1,
    justifyContent: 'center',  // Centrer horizontalement
    alignItems: 'center',      // Centrer verticalement
    padding: 10,               // Un peu de padding autour du bouton pour la taille
  },
});
