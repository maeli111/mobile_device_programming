import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebaseConfig'; // ✅ Import direct de db depuis firebaseConfig
import { Ionicons } from '@expo/vector-icons';

const AppointmentScreen = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async (date: Date) => {
    setSelectedDate(date);
    setDatePickerVisibility(false);
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'appointments'), {
        userId: 'user123', // Remplace par l'ID réel de l'utilisateur connecté
        serviceId: 'service456', // Remplace par l'ID réel du service sélectionné
        date,
        status: 'pending',
      });
      console.log('✅ Rendez-vous ajouté avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout du rendez-vous :', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📅 Prendre un Rendez-vous</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Choisissez une date et une heure :</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setDatePickerVisibility(true)}
        >
          <Ionicons name="calendar" size={24} color="#fff" />
          <Text style={styles.buttonText}>Sélectionner une date</Text>
        </TouchableOpacity>

        {selectedDate && (
          <View style={styles.dateContainer}>
            <Ionicons name="time" size={20} color="#4CAF50" />
            <Text style={styles.dateText}>
              {selectedDate.toLocaleString()}
            </Text>
          </View>
        )}

        {isSubmitting && <Text style={styles.loadingText}>Enregistrement...</Text>}
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisibility(false)}
      />
    </SafeAreaView>
  );
};

export default AppointmentScreen;

// ✅ STYLES MODERNES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
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
