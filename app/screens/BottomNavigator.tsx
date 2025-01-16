import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';  

const BottomNavigator = () => {
  const router = useRouter(); 
  
  const navigateToHome = () => {
    router.push('/');
  };

  const navigateToMap = () => {
    router.push('/Map');
  };

  const navigateToSearch = () => {
    router.push('/Search');
  };
  
  const navigateToBooking = () => {
    router.push('/Booking'); 
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
    backgroundColor: '#B53302', 
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#E97D01', 
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
    justifyContent: 'center',  
    alignItems: 'center',      
    padding: 10,               
  },
});
