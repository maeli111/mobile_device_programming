import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, TextInput, FlatList, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, collection, getDocs, doc, setDoc, getDoc, deleteField } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../../firebaseConfig'; 
import Header from '../screens/Header';
import BottomTabNavigator from '../screens/BottomNavigator';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allActivities, setAllActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [favorites, setFavorites] = useState({});

  const auth = getAuth();
  const db = getFirestore(app);

  const fetchActivities = async () => {
    const activitiesCollection = collection(db, 'activities');
    const snapshot = await getDocs(activitiesCollection);
    const activitiesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    setAllActivities(activitiesList);
    setFilteredActivities(activitiesList); 
  };

  const fetchFavorites = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const userEmail = currentUser.email;
    const docRef = doc(db, 'favorites', userEmail);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setFavorites(docSnap.data());
    }
  };

  const addToFavorites = async (activity) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Connexion requise", "Vous devez être connecté pour ajouter des favoris.");
      return;
    }

    const userEmail = currentUser.email;
    const docRef = doc(db, 'favorites', userEmail);

    await setDoc(docRef, { [activity.title]: activity.title }, { merge: true });

    setFavorites((prev) => ({ ...prev, [activity.title]: activity.title }));
    Alert.alert("Favori ajouté", "L'activité a été ajoutée à vos favoris.");
  };

  const removeFromFavorites = async (activity) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Connexion requise", "Vous devez être connecté pour retirer des favoris.");
      return;
    }

    const userEmail = currentUser.email;
    const docRef = doc(db, 'favorites', userEmail);
    
    await setDoc(docRef, { [activity.title]: deleteField() }, { merge: true });

    setFavorites((prev) => {
      const updatedFavorites = { ...prev };
      delete updatedFavorites[activity.title];  
      return updatedFavorites;
    });

    Alert.alert("Favori retiré", "L'activité a été retirée de vos favoris.");
  };

  const toggleFavorite = (activity) => {
    if (favorites[activity.title]) {
      removeFromFavorites(activity);
    } else {
      addToFavorites(activity);
    }
  };

  const filterActivities = (query) => {
    const normalizedQuery = query.toLowerCase();
    const filtered = allActivities.filter((activity) => {
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

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    filterActivities(query);
  };

  useEffect(() => {
    fetchActivities();
    fetchFavorites();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <SafeAreaView style={styles.containerActivities}>
        <Text style={styles.title}>Search activities</Text>

        <TouchableOpacity
          style={styles.searchIconContainer}
          onPress={() => setIsSearchVisible(!isSearchVisible)}
        >
          <Ionicons name="search" size={24} color="#B53302" />
        </TouchableOpacity>

        {isSearchVisible && (
          <TextInput
            style={styles.searchBar}
            placeholder="Search activities by title, price, duration, or location..."
            placeholderTextColor="#FEDB9B"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
        )}

        <FlatList
          data={filteredActivities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.activityCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.activityTitle}>{item.title}</Text>
                <TouchableOpacity onPress={() => toggleFavorite(item)}>
                  <Ionicons
                    name={favorites[item.title] ? 'heart' : 'heart-outline'}
                    size={24}
                    color={favorites[item.title] ? '#FF0000' : '#000'}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.activityTitle2}>{item.description}</Text>
              <Text style={styles.activityDetails}>Price: {item.price}€</Text>
              <Text style={styles.activityDetails}>Duration: {item.duration} mins</Text>
              <Text style={styles.activityDetails}>Location: {item.location}</Text>
              {item.rating !== undefined && item.numberOfReviews > 0 && (
                <Text style={styles.ratingDetails}>
                  {item.rating} ★ ({item.numberOfReviews} reviews)
                </Text>
              )}
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyMessage}>No activities match your search.</Text>
          }
        />
      </SafeAreaView>
      <BottomTabNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEDB9B', 
  },
  containerActivities: {
    flex: 1,
    backgroundColor: '#FEDB9B', 
    marginBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B53302',
    marginTop: 45,
    textAlign: 'center',
  },
  searchIconContainer: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    marginRight: 20,
  },
  searchBar: {
    height: 40,
    borderColor: '#E97D01',
    borderWidth: 1,
    borderRadius: 8,
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#FCAC23', 
    color: '#B53302', 
    fontWeight: 'bold',
  },
  activityCard: {
    backgroundColor: '#FECA64', 
    padding: 20,
    marginVertical: 10,
    borderRadius: 12,
    width: '95%',
    alignSelf: 'center',
    shadowColor: '#B53302',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  activityTitle: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#B53302', 
  },
  activityTitle2: {
    fontSize: 15,
    color: '#E97D01', 
  },
  activityDetails: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  ratingDetails: {
    fontSize: 14,
    color: '#E97D01',
    fontWeight: 'bold',
    marginTop: 5,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#B53302',
    marginTop: 20,
    fontSize: 16,
    fontWeight: '500',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default SearchPage;
