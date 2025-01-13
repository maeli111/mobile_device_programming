import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Header from '../screens/Header';
import BottomNavigator from '../screens/BottomNavigator';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function ConnexionScreen() {
  const router = useRouter();
  const auth = getAuth();

  const [user, setUser] = useState(null);
  const images = [
    require('../../assets/images/activite1.jpg'),
    require('../../assets/images/activite2.jpg'),
    require('../../assets/images/activite3.jpg'),
    require('../../assets/images/activite4.jpg'),
    require('../../assets/images/activite5.jpg'),
    require('../../assets/images/activite6.jpg'),
  ];

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

  // Redirige vers la page de recherche
  const goToSearch = () => {
    router.push('/Search');
  };

  return (
  <View style={styles.container}>
    {/* Header */}
    <Header />

    {/* Contenu Principal */}
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        {user ? (
          <Text style={styles.Text}>
            Connected: Welcome, {user.displayName || 'Utilisateur'}!
          </Text>
        ) : (
          <>
            <Text style={styles.Text}>
              Not Connected: To enjoy all the features of the application, please connect.
            </Text>
            <TouchableOpacity style={styles.loginButton} onPress={goToLogin}>
              <Text style={styles.Text}>Log in</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Galerie d'Images en Grille */}
        <Text style={styles.galleryTitle}>Popular Activities</Text>
        <View style={styles.galleryGrid}>
          {images.map((image, index) => (
            <Image
              key={index}
              source={image}
              style={styles.activityImage}
            />
          ))}
        </View>

        {/* Rectangle Arrondi Interactif */}
        <TouchableOpacity style={styles.activityBox} onPress={goToSearch}>
          <Text style={styles.activityText}>See Activities</Text>
          <Text style={styles.arrow}>➜</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>

    {/* Bottom Navigator */}
    <BottomNavigator />
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEDB9B',
  },
  scrollContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {

    marginTop : 50,
    
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
  Text: {
    fontSize: 8,
    color: '#fff',
    fontWeight: 'bold',
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B53302',
    marginVertical: 10,
    textAlign: 'center',
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  activityImage: {
    width: '48%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#ccc',
  },
  activityBox: {
    backgroundColor: '#B53302',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  activityText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  arrow: {
    color: '#fff',
    fontSize: 24,
    marginLeft: 10,
  },
  loginButton: {
    backgroundColor: '#B53302',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: 'flex-start', 
  },
});