import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebaseConfig'; // ✅ Direct import of db from firebaseConfig
import { Ionicons } from '@expo/vector-icons';
import Header from '../screens/Header'; // Ensure the correct path
import BottomTabNavigator from '../screens/BottomNavigator'; // Ensure the correct path

const AppointmentScreen = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle date confirmation and save to Firestore
  const handleConfirm = async (date: Date) => {
    setSelectedDate(date);
    setDatePickerVisibility(false);
    setIsSubmitting(true);
    try {
      // Save appointment details in Firestore
      await addDoc(collection(db, 'appointments'), {
        userId: 'user123', // Replace with the actual logged-in user's ID
        serviceId: 'service456', // Replace with the actual selected service ID
        date,
        status: 'pending',
      });
      console.log('✅ Appointment successfully added');
    } catch (error) {
      console.error('❌ Error adding appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    
    <View style={styles.container}>
      <Header />
      {/* Header component */}

      {/* Main content */}
      <View style={styles.content}>
        <Text style={styles.title}>📅 Schedule an Appointment</Text>
        
        <View style={styles.card}>
          <Text style={styles.label}>Select a date and time:</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setDatePickerVisibility(true)}
          >
            <Ionicons name="calendar" size={24} color="#fff" />
            <Text style={styles.buttonText}>Select a Date</Text>
          </TouchableOpacity>

          {/* Display selected date */}
          {selectedDate && (
            <View style={styles.dateContainer}>
              <Ionicons name="time" size={20} color="#4CAF50" />
              <Text style={styles.dateText}>
                {selectedDate.toLocaleString()}
              </Text>
            </View>
          )}

          {/* Show loading state while submitting */}
          {isSubmitting && <Text style={styles.loadingText}>Saving...</Text>}
        </View>

        {/* Date Picker Modal */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={() => setDatePickerVisibility(false)}
        />
      </View>

      {/* Bottom Navigation component */}
      <BottomTabNavigator />
    </View>
  );
};

export default AppointmentScreen;

// ✅ MODERN STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 14,
    marginLeft: 8,
    color: '#2E7D32',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#888',
  },
});
