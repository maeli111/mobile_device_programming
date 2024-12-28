import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const HomeScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Titre de la page */}
      <Text style={styles.title}>Explore Malta</Text>
      <Text style={styles.subtitle}>Discover the best tourist spots in Malta</Text>
      
      {/* Section de la carte */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 35.944694, // Latitude pour Malte
            longitude: 14.381008, // Longitude pour Malte
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
        >
          {/* Points d'intérêt */}
          <Marker
            coordinate={{ latitude: 35.898908, longitude: 14.514553 }}
            title="Valetta"
            description="Capital of Malta"
          />
          <Marker
            coordinate={{ latitude: 35.885834, longitude: 14.403056 }}
            title="Mdina"
            description="The Silent City"
          />
          <Marker
            coordinate={{ latitude: 36.014118, longitude: 14.324206 }}
            title="Blue Lagoon"
            description="Lagoon with crystal-clear water"
          />
          <Marker
            coordinate={{ latitude: 35.933869, longitude: 14.3444612 }}
            title="Golden Bay"
            description="A popular sandy beach"
          />
          <Marker
            coordinate={{ latitude: 35.8326, longitude: 14.4147 }}
            title="Hagar Qim Temples"
            description="A prehistoric temple complex"
          />
          <Marker
            coordinate={{ latitude: 35.84194, longitude: 14.54306 }}
            title="Marsaxlokk"
            description="A traditional fishing village"
          />
          <Marker
            coordinate={{ latitude: 35.8769 , longitude: 14.5219 }}
            title="The Three Cities"
            description="The historical fortified cities of Birgu, Senglea, and Cospicua"
          />
          <Marker
            coordinate={{ latitude: 36.0534, longitude: 14.2387 }}
            title="Gozo"
            description="The second island of Malta"
          />
          <Marker
            coordinate={{ latitude: 35.944694, longitude: 14.381008 }}
            title="Popeye Village"
            description="The film set for the 1980 Popeye movie"
          />
          <Marker
            coordinate={{ latitude: 35.9238, longitude: 14.4895 }}
            title="Paceville"
            description="The nightlife hub of Malta"
          />
          <Marker
            coordinate={{ latitude: 35.944694, longitude: 14.381008 }}
            title="Paradise Bay"
            description="A secluded sandy beach"
          />
          <Marker
            coordinate={{ latitude: 35.8331286, longitude: 14.5621187 }}
            title="St. Peter's Pool"
            description="A natural swimming pool"
          />
          <Marker
            coordinate={{ latitude: 35.912224, longitude: 14.504167 }}
            title="Sliema"
            description="A popular and dynamic area"
          />
        </MapView>
      </View>

      {/* Liste des points d'intérêt */}
      <View style={styles.poiList}>
        <View style={styles.poiItem}>
          <Text style={styles.poiTitle}>Valetta</Text>
          <Text style={styles.poiDescription}>The capital of Malta, known for its historic architecture and UNESCO World Heritage Sites.</Text>
        </View>
        <View style={styles.poiItem}>
          <Text style={styles.poiTitle}>Mdina</Text>
          <Text style={styles.poiDescription}>The Silent City, a medieval walled city offering stunning views and a rich history.</Text>
        </View>
        <View style={styles.poiItem}>
          <Text style={styles.poiTitle}>Blue Lagoon</Text>
          <Text style={styles.poiDescription}>A lagoon with crystal-clear water, perfect for swimming and relaxation.</Text>
        </View>
        <View style={styles.poiItem}>
          <Text style={styles.poiTitle}>Golden Bay</Text>
          <Text style={styles.poiDescription}>A sandy beach that’s perfect for a relaxing day in the sun.</Text>
        </View>
        <View style={styles.poiItem}>
          <Text style={styles.poiTitle}>Hagar Qim Temples</Text>
          <Text style={styles.poiDescription}>A prehistoric temple complex, offering insight into Malta's ancient past.</Text>
        </View>
        <View style={styles.poiItem}>
          <Text style={styles.poiTitle}>Marsaxlokk</Text>
          <Text style={styles.poiDescription}>A traditional fishing village, famous for its colorful boats and seafood markets.</Text>
        </View>
        <View style={styles.poiItem}>
          <Text style={styles.poiTitle}>The Three Cities</Text>
          <Text style={styles.poiDescription}>Birgu, Senglea, and Cospicua, historical fortified cities with rich cultural heritage.</Text>
        </View>
        <View style={styles.poiItem}>
          <Text style={styles.poiTitle}>Gozo</Text>
          <Text style={styles.poiDescription}>Malta's sister island, known for its tranquil atmosphere and natural beauty.</Text>
        </View>
        <View style={styles.poiItem}>
          <Text style={styles.poiTitle}>Popeye Village</Text>
          <Text style={styles.poiDescription}>The movie set for the 1980 Popeye film, now a fun theme park.</Text>
        </View>
        <View style={styles.poiItem}>
          <Text style={styles.poiTitle}>Paceville</Text>
          <Text style={styles.poiDescription}>Malta’s entertainment and nightlife hotspot, full of bars and clubs.</Text>
        </View>
        <View style={styles.poiItem}>
          <Text style={styles.poiTitle}>Paradise Bay</Text>
          <Text style={styles.poiDescription}>A quiet and beautiful bay, perfect for a relaxing day at the beach.</Text>
        </View>
        <View style={styles.poiItem}>
          <Text style={styles.poiTitle}>St. Peter's Pool</Text>
          <Text style={styles.poiDescription}>A natural swimming pool with crystal-clear waters, ideal for a refreshing swim.</Text>
        </View>
        <View style={styles.poiItem}>
          <Text style={styles.poiTitle}>Sliema</Text>
          <Text style={styles.poiDescription}>A bustling area known for its shopping, dining, and lively promenade.</Text>
        </View>
      </View>

    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingBottom: 60, 
  },
  
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 50,  
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  mapContainer: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.45,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
  },
  map: {
    flex: 1,
  },
  poiList: {
    flexGrow: 1,
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 20,
    width: '100%',
  },
  poiItem: {
    width: Dimensions.get('window').width * 0.9,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  poiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  poiDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});
