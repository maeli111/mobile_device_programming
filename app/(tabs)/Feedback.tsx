import React, { useEffect, useState } from 'react'; 
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, TouchableOpacity } from 'react-native'; 
import { getAuth } from 'firebase/auth'; 
import { app } from '../../firebaseConfig'; 
import { getFirestore, collection, getDocs, query, where, getDoc, doc, updateDoc } from 'firebase/firestore'; 
import { useRouter } from 'expo-router'; 
import Header from '../screens/Header'; 
import BottomTabNavigator from '../screens/BottomNavigator';

const Feedbacks = () => { 
  const auth = getAuth(app); 
  const router = useRouter(); 
  const [appointments, setAppointments] = useState([]); 
  const [activities, setActivities] = useState({});

  
  useEffect(() => { 
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "You must be logged in to access this page.", [
        { text: "OK", onPress: () => router.push('/LoginScreen'), }
      ]);
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

  
  const submitRating = async (appointmentId, rating) => {
    try {
      const db = getFirestore(app);
      const appointmentRef = doc(db, 'appointments', appointmentId);
  
      const activityId = appointments.find(appointment => appointment.id === appointmentId).activityID;
      const activityRef = doc(db, 'activities', activityId);
      const activityDoc = await getDoc(activityRef);
  
      if (activityDoc.exists()) {
        const activityData = activityDoc.data();
        const currentRating = activityData.rating || 0;  
        const numberOfReviews = activityData.numberOfReviews || 0;  
  
        
        const newNumberOfReviews = numberOfReviews + 1;
        const newRating = Math.round(((currentRating * numberOfReviews) + rating) / newNumberOfReviews * 10) / 10;
  
        
        await updateDoc(activityRef, {
          rating: newRating,
          numberOfReviews: newNumberOfReviews,
        });
        
        await updateDoc(appointmentRef, { rating });
  
        Alert.alert("Thank you!", "Your feedback has been recorded.");
  
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment.id === appointmentId ? { ...appointment, rating } : appointment
          )
        );
      } else {
        Alert.alert("Error", "Activity not found.");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      Alert.alert("Error", "An error occurred while submitting your feedback.");
    }
  };
  
  return (
    <View style={styles.container}>
      <Header />

      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.mainContent}>
            <Text style={styles.title}>My Feedbacks</Text>

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
                      <Text style={styles.appointmentText}>Activity: {activity ? activity.title : 'Unknown'}</Text>
                      <Text style={styles.appointmentText}>Price: {activity ? `$${activity.price}` : 'N/A'}</Text>

                      {appointment.rating !== undefined ? (
                        <Text style={styles.alreadyRated}>You have already rated this activity: {appointment.rating} ★</Text>
                      ) : (
                        <>
                          <Text style={styles.instructions}>Rate this activity:</Text>
                          <View style={styles.ratingContainer}>
                            {[0, 1, 2, 3, 4, 5].map((star) => (
                              <TouchableOpacity
                                key={star}
                                style={styles.starButton}
                                onPress={() => submitRating(appointment.id, star)}
                              >
                                <Text style={styles.star}>{star} ★</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </>
                      )}
                    </View>
                  );
                })}
              </View>
            )}

            {pastAppointments.length === 0 && (
              <Text style={styles.message}>You have no past activities to rate. Once you attend an activity, you can provide feedback here!</Text>
            )}
          </View>
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#B53302',
    textAlign: 'center',
    marginVertical: 30,
    elevation: 3,
    shadowColor: '#B53302',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#FECA64', 
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
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
    textAlign: 'center',
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
  appointmentText: {
    fontSize: 16,
    color: '#333',
  },
  instructions: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  starButton: {
    padding: 10,
  },
  star: {
    fontSize: 18,
    color: '#E97D01',
  },
  alreadyRated: {
    fontSize: 16,
    color: '#4CAF50',
    marginTop: 10,
  },
});

export default Feedbacks;
