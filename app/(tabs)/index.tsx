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

  const logo = require('../../assets/images/logo.png'); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); 
  }, [auth]);

  const goToLogin = () => {
    router.push('/LoginScreen');
  };

  const goToSearch = () => {
    router.push('/Search');
  };
  
  const goToBooking = () => {
    router.push('/Booking');
  };

  return (
  <View style={styles.container}>
    <Header />

    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        {user ? (
          <Text style={styles.Text}>
            Connected: Welcome ! 
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

        <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} />
        </View>

        <Text style={styles.galleryTitle}>Popular Activities</Text>
        <TouchableOpacity style={styles.galleryGrid} onPress={goToSearch}>
          {images.map((image, index) => (
            <Image
              key={index}
              source={image}
              style={styles.activityImage}
            />
          ))}
        </TouchableOpacity>

        <TouchableOpacity style={styles.activityBox} onPress={goToSearch}>
          <Text style={styles.activityText}>See Activities</Text>
          <Text style={styles.arrow}>➜</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.activityBox} onPress={goToBooking}>
          <Text style={styles.activityText}>Book an activity</Text>
          <Text style={styles.arrow}>➜</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>

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
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 90, 
    height: 90,
    resizeMode: 'contain',
  },
  content: {
    marginTop : 50,
    marginBottom: 100,    
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