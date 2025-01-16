import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { app } from '../../firebaseConfig'; 
import { getFirestore, collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import { useRouter } from 'expo-router'; 
import Header from '../screens/Header';
import BottomTabNavigator from '../screens/BottomNavigator';

const Reservation = () => {
  const auth = getAuth(app);
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [activities, setActivities] = useState({});

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
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
      const fetchAppointments = async () => {
        try {
          const db = getFirestore(app);

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

  const pastAppointments = appointments.filter((appointment) => appointment.date.toDate ? appointment.date.toDate() < new Date() : new Date(appointment.date) < new Date());
  const futureAppointments = appointments.filter((appointment) => appointment.date.toDate ? appointment.date.toDate() >= new Date() : new Date(appointment.date) >= new Date());

  return (
    <View style={styles.container}>
      <Header />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.title}>My Reservations</Text>

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
                    <Text style={styles.appointmentText}>Location: {activity ? activity.location : 'Unknown'}</Text>
                    <Text style={styles.appointmentText}>Activity: {activity ? activity.title : 'Unknown'}</Text>
                    <Text style={styles.appointmentText}>Description: {activity ? activity.description : 'No description available'}</Text>
                    <Text style={styles.appointmentText}>Price: {activity ? `$${activity.price}` : 'N/A'}</Text>
                  </View>
                );
              })}
            </View>
          )}

          {pastAppointments.length === 0 && futureAppointments.length === 0 && (
            <Text style={styles.message}>You have no reservations.</Text>
          )}
        </ScrollView>
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
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#B53302',
    textAlign: 'center',
    paddingVertical: 10,
    marginTop: 40,
    elevation: 3,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#FECA64',
    borderRadius: 10,
    padding: 15,
    margin: 15,
    shadowColor: '#B53302',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B53302',
    marginBottom: 10,
  },
  appointmentCard: {
    backgroundColor: '#FEDB9B',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#B53302',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    borderColor: '#E97D01',
    borderWidth: 1,
   },
   appointmentText:{
     fontSize :16 ,
     color:'#333',
   },
   message:{
     fontSize :16 ,
     textAlign :'center',
     color:'#555',
     marginTop :10 ,
   }
});

export default Reservation;
