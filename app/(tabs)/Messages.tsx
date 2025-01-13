import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assurez-vous d'avoir installé @expo/vector-icons
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig'; // Assurez-vous que le chemin est correct
import Header from '../screens/Header';
import BottomTabNavigator from '../screens/BottomNavigator';

const DateTimeSelectionPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allActivities, setAllActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false); // État pour gérer la visibilité de la barre de recherche

  // Fonction pour récupérer les activités depuis Firestore
  const fetchActivities = async () => {
    const db = getFirestore(app);
    const activitiesCollection = collection(db, 'activities');
    const snapshot = await getDocs(activitiesCollection);
    const activitiesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAllActivities(activitiesList);
    setFilteredActivities(activitiesList); // Initialiser avec toutes les activités
  };

  // Filtrage des activités en fonction de la recherche
  const filterActivities = (query) => {
    const normalizedQuery = query.toLowerCase();
    const filtered = allActivities.filter((activity) => {
      // Convertir 'duration' en chaîne de caractères si ce n'est pas déjà une chaîne
      const durationStr = activity.duration ? activity.duration.toString().toLowerCase() : '';

      return (
        activity.title.toLowerCase().includes(normalizedQuery) ||
        activity.price.toString().includes(normalizedQuery) ||
        durationStr.includes(normalizedQuery) ||
        activity.location.toLowerCase().includes(normalizedQuery)
      );
    });
    setFilteredActivities(filtered);
  };

  // Gestion du changement dans la barre de recherche
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    filterActivities(query);
  };

  // Récupérer les activités lors du montage du composant
  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <View style={styles.container}>
      <Header />

      {/* Icône de recherche */}
      <TouchableOpacity
        style={styles.searchIconContainer}
        onPress={() => setIsSearchVisible(!isSearchVisible)} // Alterner la visibilité de la barre de recherche
      >
        <Ionicons name="search" size={24} color="#000" />
      </TouchableOpacity>

      {/* Barre de recherche (visible uniquement si isSearchVisible est vrai) */}
      {isSearchVisible && (
        <TextInput
          style={styles.searchBar}
          placeholder="Search activities by title, price, duration, or location..."
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
      )}

      {/* Liste des activités */}
      <FlatList
        data={filteredActivities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.activityCard}>
            <Text style={styles.activityTitle}>{item.title}</Text>
            <Text style={styles.activityDetails}>Price: ${item.price}</Text>
            <Text style={styles.activityDetails}>Duration: {item.duration}</Text>
            <Text style={styles.activityDetails}>Location: {item.location}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No activities match your search.</Text>
        }
      />

      <BottomTabNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 10,
  },
  searchIconContainer: {
    alignSelf: 'flex-end',
    marginTop: 20,
    marginBottom: 10,
    marginRight: 10,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  activityCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  activityDetails: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  },
});

export default DateTimeSelectionPage;
