import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have @expo/vector-icons installed
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig'; // Ensure the path is correct
import Header from '../screens/Header';
import BottomTabNavigator from '../screens/BottomNavigator';

const DateTimeSelectionPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allActivities, setAllActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Fetch activities from Firestore
  const fetchActivities = async () => {
    const db = getFirestore(app);
    const activitiesCollection = collection(db, 'activities');
    const snapshot = await getDocs(activitiesCollection);
    const activitiesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAllActivities(activitiesList);
    setFilteredActivities(activitiesList); // Initialize with all activities
  };

  // Filter activities based on search query
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
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Search activities</Text>

        {/* Search Icon */}
        <TouchableOpacity
          style={styles.searchIconContainer}
          onPress={() => setIsSearchVisible(!isSearchVisible)}
        >
          <Ionicons name="search" size={24} color="#B53302" />
        </TouchableOpacity>

        {/* Search Bar */}
        {isSearchVisible && (
          <TextInput
            style={styles.searchBar}
            placeholder="Search activities by title, price, duration, or location..."
            placeholderTextColor="#FEDB9B"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
        )}

        {/* Activity List */}
        <FlatList
          data={filteredActivities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.activityCard}>
              <Text style={styles.activityTitle}>{item.title}</Text>
              <Text style={styles.activityDetails}>Price: ${item.price}</Text>
              <Text style={styles.activityDetails}>Duration: {item.duration} mins</Text>
              <Text style={styles.activityDetails}>Location: {item.location}</Text>
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
    backgroundColor: '#FEDB9B', // Main background color
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
    backgroundColor: '#FCAC23', // Search bar background
    color: '#B53302', // Input text color
    fontWeight: 'bold',
  },
  activityCard: {
    backgroundColor: '#FECA64', // Card background
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
    fontWeight: 'bold',
    color: '#B53302', // Title color
  },
  activityDetails: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#B53302',
    marginTop: 20,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DateTimeSelectionPage;
