import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const UnderConstructionPage = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://via.placeholder.com/150' }} // Remplacez l'URL par l'image de votre choix
        style={styles.image}
      />
      <Text style={styles.title}>Page en construction</Text>
      <Text style={styles.message}>Cette page est actuellement en cours de construction. Revenez plus tard !</Text>
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
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginTop: 10,
  },
});

export default UnderConstructionPage;
