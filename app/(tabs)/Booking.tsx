import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const AvailableBookingsScreen = () => {
  // Liste des réservations disponibles
  const availableBookings = [
    {
      id: 1,
      title: 'Scuba Diving Experience',
      description: 'Explore the underwater world of Malta.',
      date: 'January 15, 2024',
      time: '10:00 AM',
    },
    {
      id: 2,
      title: 'Guided City Tour',
      description: 'Take a walking tour through the historic streets of Valletta.',
      date: 'January 16, 2024',
      time: '1:00 PM',
    },
    {
      id: 3,
      title: 'Cooking Class',
      description: 'Learn to cook traditional Maltese dishes.',
      date: 'January 17, 2024',
      time: '11:00 AM',
    },
    {
      id: 4,
      title: 'Boat Trip to Comino',
      description: 'A relaxing boat ride to the beautiful Comino island.',
      date: 'January 18, 2024',
      time: '9:00 AM',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Available Bookings</Text>
      <Text style={styles.subtitle}>Explore the available experiences for your next trip to Malta.</Text>

      {/* Liste des réservations disponibles */}
      {availableBookings.map((booking) => (
        <View key={booking.id} style={styles.bookingCard}>
          <Text style={styles.bookingTitle}>{booking.title}</Text>
          <Text style={styles.bookingDescription}>{booking.description}</Text>
          <Text style={styles.bookingDate}>{booking.date} at {booking.time}</Text>

          {/* Zone indiquant qu'il n'est pas possible de réserver */}
          <TouchableOpacity style={styles.buttonDisabled} disabled={true}>
            <Text style={styles.buttonText}>No booking available</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default AvailableBookingsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 80, 
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    paddingTop: 30,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  bookingCard: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  bookingDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  bookingDate: {
    fontSize: 14,
    color: '#333',
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#ddd',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#999',
    fontWeight: 'bold',
  },
});
