import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur NomadEscape!</Text>
      <Text style={styles.subtitle}>Voici tout ce qu'il y a à faire :</Text>
      
      {/* Carte de Malte */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 35.8997, // Latitude pour Malte
            longitude: 14.5146, // Longitude pour Malte
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
        >
          {/* Exemple de point d'intérêt */}
          <Marker
            coordinate={{ latitude: 35.8997, longitude: 14.5146 }}
            title="La Valette"
            description="Capitale de Malte"
          />
        </MapView>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  mapContainer: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.5,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 20,
  },
  map: {
    flex: 1,
  },
});
