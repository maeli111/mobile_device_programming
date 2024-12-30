// BottomTabNavigator.tsx
import React from 'react';
import { useRouter } from 'expo-router';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

// Création du Tab Navigator
const Tab = createBottomTabNavigator();

// Composants vides pour les écrans
function HomeScreen() {
    return <View />;
  }
  
  function MapScreen() {
    return <View />;
  }
  
  function SearchScreen() {
    return <View />;
  }
  
  function MessageScreen() {
    return <View />;
  }


export default function BottomTabNavigator() {
  const router = useRouter(); // Pour gérer la navigation

  // Redirige vers la page de la carte
  const map = () => {
    router.push('/Map');
  };
  
  // Redirige vers la page d'accueil
  const home = () => {
    router.push('/');
  };

  // Redirige vers la page de recherche
  const search = () => {
    router.push('/Search');
  };
  
  // Redirige vers la page de message
  const message = () => {
    router.push('/Messages');
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FCAC23', // Couleur active des icônes
        tabBarInactiveTintColor: '#FECA64', // Couleur inactive des icônes
        tabBarStyle: {
          backgroundColor: '#B53302', // Fond de la barre de navigation
          borderTopWidth: 1,
          borderTopColor: '#E97D01', // Bordure de la barre de navigation 
        },
      }}
    >
      <Tab.Screen
         name="Home"
         component={HomeScreen}
         options={{
           tabBarLabel: '',
           tabBarButton: () => (
             <TouchableOpacity onPress={home} style={styles.button}>
               <FontAwesome5 name="home" size={24} color="#FECA64" />
             </TouchableOpacity>
           ),
         }}
      />

      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: '',
          tabBarButton: () => (
            <TouchableOpacity onPress={map} style={styles.button}>
              <Ionicons name="map" size={24} color="#FECA64" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <Tab.Screen
         name="Search"
         component={SearchScreen}
         options={{
           tabBarLabel: '',
           tabBarButton: () => (
             <TouchableOpacity onPress={search} style={styles.button}>
               <FontAwesome5 name="search" size={24} color="#FECA64" />
             </TouchableOpacity>
           ),
         }}
      />

      <Tab.Screen
       name="Messages"
       component={MessageScreen}
       options={{
         tabBarLabel: '',
         tabBarButton: () => (
           <TouchableOpacity onPress={message} style={styles.button}>
             <Ionicons name="chatbubbles" size={24} color="#FECA64" />
           </TouchableOpacity>
         ),
       }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',  // Centrer horizontalement
    alignItems: 'center',      // Centrer verticalement
    padding: 10,               // Un peu de padding autour du bouton pour la taille
  },
});

