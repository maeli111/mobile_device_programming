import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { app } from '../../firebaseConfig'; // Assurez-vous que le chemin est correct
import { getFirestore, collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import { useRouter } from 'expo-router'; // Pour la navigation
import Header from '../screens/Header';
import BottomTabNavigator from '../screens/BottomNavigator';

const UnderConstructionPage = () => {
  const auth = getAuth(app);
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [activities, setActivities] = useState({});

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      // Si aucun utilisateur n'est connecté
      Alert.alert(
        "Error",
        "You must be logged in to access this page.",
        [
          {
            text: "OK",
            onPress: () => router.push('/LoginScreen'),
          },
        ]
      );
    } else {
      // Si un utilisateur est connecté, récupérer les réservations et les activités
      const fetchAppointments = async () => {
        try {
          const db = getFirestore(app);

          // Filtrer par l'email de l'utilisateur connecté (customerID)
          const q = query(
            collection(db, 'appointments'),
            where('customerID', '==', user.email)
          );

          const querySnapshot = await getDocs(q);

          const appointmentsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setAppointments(appointmentsData);

          // Charger les activités liées aux rendez-vous
          const activityIds = [...new Set(appointmentsData.map((appointment) => appointment.activityID))];
          const activitiesData = {};

          for (const activityID of activityIds) {
            const activityDoc = await getDoc(doc(db, 'activities', activityID));
            if (activityDoc.exists()) {
              activitiesData[activityID] = activityDoc.data();
            }
          }

          setActivities(activitiesData);
        } catch (error) {
          console.error("Error fetching appointments or activities:", error);
        }
      };

      fetchAppointments();
    }
  }, []);

  // Séparer les rendez-vous passés et futurs
  const pastAppointments = appointments.filter((appointment) => appointment.date.toDate ? appointment.date.toDate() < new Date() : new Date(appointment.date) < new Date());
  const futureAppointments = appointments.filter((appointment) => appointment.date.toDate ? appointment.date.toDate() >= new Date() : new Date(appointment.date) >= new Date());

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />

      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.mainContent}>
            <Text style={styles.title}>My Reservations</Text>

            {/* Rendez-vous passés */}
            {pastAppointments.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Past Reservations</Text>
                {pastAppointments.map((appointment) => {
                  const activity = activities[appointment.activityID];
                  const appointmentDate = appointment.date.toDate ? appointment.date.toDate() : new Date(appointment.date);

                  return (
                    <View key={appointment.id} style={styles.appointmentCard}>
                      <Text style={styles.appointmentText}>
                        {appointmentDate.toLocaleString()}
                      </Text>
                      <Text style={styles.appointmentText}>Location: {activity ? activity.location : 'No location'}</Text>
                      <Text style={styles.appointmentText}>Activity: {activity ? activity.title : 'Unknown'}</Text>
                      <Text style={styles.appointmentText}>Description: {activity ? activity.description : 'No description available'}</Text>
                      <Text style={styles.appointmentText}>Price: {activity ? `$${activity.price}` : 'N/A'}</Text>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Rendez-vous futurs */}
            {futureAppointments.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Upcoming Reservations</Text>
                {futureAppointments.map((appointment) => {
                  const activity = activities[appointment.activityID];
                  const appointmentDate = appointment.date.toDate ? appointment.date.toDate() : new Date(appointment.date);

                  return (
                    <View key={appointment.id} style={styles.appointmentCard}>
                      <Text style={styles.appointmentText}>
                        {appointmentDate.toLocaleString()}
                      </Text>
                      <Text style={styles.appointmentText}>Location: {appointment.location}</Text>
                      <Text style={styles.appointmentText}>Activity: {activity ? activity.title : 'Unknown'}</Text>
                      <Text style={styles.appointmentText}>Description: {activity ? activity.description : 'No description available'}</Text>
                      <Text style={styles.appointmentText}>Price: {activity ? `$${activity.price}` : 'N/A'}</Text>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Si aucun rendez-vous */}
            {pastAppointments.length === 0 && futureAppointments.length === 0 && (
              <Text style={styles.message}>You have no reservations.</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* BottomTabNavigator */}
      <BottomTabNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  mainContent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B53302',
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
    width: '100%',
    padding: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#B53302',
    marginBottom: 10,
    textAlign: 'center',
  },
  appointmentCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  appointmentText: {
    fontSize: 16,
    color: '#333',
  },
});

export default UnderConstructionPage;
