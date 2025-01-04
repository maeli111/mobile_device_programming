import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Header from '../screens/Header'; // Import the Header component
import BottomTabNavigator from '../screens/BottomNavigator'; // Import the Bottom Navigation component

const UnderConstructionPage = () => {
  return (
    <View style={styles.container}>
      {/* Header component at the top */}
      <Header />

      {/* Main content of the Under Construction page */}
      <View style={styles.content}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }} // Replace with your desired image URL
          style={styles.image}
        />
        <Text style={styles.title}>Page Under Construction</Text>
        <Text style={styles.message}>This page is currently under construction. Please check back later!</Text>
      </View>

      {/* Bottom navigation component at the bottom */}
      <BottomTabNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    marginBottom: 50, // To give some space above the bottom navigation
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B53302', // Dark red color for the title
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555', // Dark grey color for the message
    marginTop: 10,
  },
});

export default UnderConstructionPage;
