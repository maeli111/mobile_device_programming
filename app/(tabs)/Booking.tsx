import { StyleSheet, SafeAreaView, View, Text, Pressable, ActivityIndicator, Alert, ScrollView, RefreshControl, Modal, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import Activity from '@/components/Activity';
import { collection, doc, setDoc, getDocs, getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../../firebaseConfig.js';
import { initializeApp } from 'firebase/app';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { CustomerSheetBeta, initPaymentSheet, presentPaymentSheet, StripeProvider } from '@stripe/stripe-react-native';
import { publicKey } from '@/constants/StripePublicKey';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';
import Header from '../screens/Header';
import BottomTabNavigator from '../screens/BottomNavigator';

function ActivityList() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();
  const [user, setUser] = useState(null);

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(true);
  const [reservedSlots, setReservedSlots] = useState([]);

  const fetchReservedSlots = async (activityID, date) => {
    try {
      const appointmentsRef = collection(db, "appointments");
      const querySnapshot = await getDocs(appointmentsRef);
      const reserved = querySnapshot.docs
        .map(doc => doc.data())
        .filter(
          appointment =>
            appointment.activityID === activityID &&
            new Date(appointment.date.toDate()).toDateString() === date.toDateString()
        )
        .map(appointment => new Date(appointment.date.toDate()).getHours());
      setReservedSlots(reserved);
    } catch (error) {
      console.error("Error fetching reserved slots:", error);
    }
  };

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert(
        "Error",
        "You must be logged in to access this page.",
        [
          {
            text: "OK",
            onPress: () => {
              router.push('/LoginScreen');
            },
          },
        ]
      );
      return;
    }

    setUser(currentUser);
  }, []);

  useEffect(() => {
    if (selectedActivity) {
      fetchReservedSlots(selectedActivity.id, selectedDate);
    }
  }, [selectedDate, selectedActivity]);

  const getActivities = async () => {
    const res = await getDocs(collection(db, "activities"));
    return res.docs.map(doc => ({ id: doc.id, data: doc.data() }));
  };

  const createAppointment = async (user, price, activityID, status, date, timeSlot) => {
    try {
      if (!user || !user.email) {
        throw new Error("Invalid user data. Email is missing.");
      }

      const appointmentRef = doc(db, "appointments", `${user.email}-${Date.now()}`);
      await setDoc(appointmentRef, {
        user: user.displayName || "Unknown User",
        email: user.email,
        price,
        activityID,
        status,
        date: new Date(date.setHours(timeSlot, 0, 0)),
        customerID: user.email,
        createdAt: new Date(),
      });

      console.log('Appointment created successfully!');
    } catch (error) {
      console.error('Error creating appointment: ', error);
    }
  };

  const getPaymentIntent = async (price, activityID) => {
    try {
      const url = `https://getpaymentintent-olknvoqq3q-uc.a.run.app/?price=${price}&currency=eur&productID=${activityID}`;
      const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      const rawText = await response.text();
      if (!response.ok) {
        console.error(`Error from server: ${response.status} - ${rawText}`);
        throw new Error(`Server returned error: ${response.status}`);
      }
      const { paymentIntent, ephemeralKey, customer, displayName } = JSON.parse(rawText);
      return { paymentIntent, ephemeralKey, customer, displayName };
    } catch (error) {
      console.error('Error fetching payment intent:', error);
      Alert.alert('Error', 'Failed to fetch payment intent. Please try again.');
      throw error;
    }
  };

  const initializePaymentSheet = async (price, activityID) => {
    try {
      const priceInCents = Math.round(price * 100);
      const { paymentIntent, ephemeralKey, customer, displayName } = await getPaymentIntent(priceInCents, activityID);
      const { error } = await initPaymentSheet({
        merchantDisplayName: displayName,
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
      });
      if (error) {
        Alert.alert('Error', 'An error occurred while setting up the payment sheet.');
        return false;
      }
      return true;
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize payment sheet. Please try again later.');
      return false;
    }
  };

  const openPaymentSheet = async (price, activityID, date, timeSlot) => {
    try {
      const isInitialized = await initializePaymentSheet(price, activityID);
      if (!isInitialized) return;
      const { error } = await presentPaymentSheet();
      if (error) {
        Alert.alert(`Error code: ${error.code}`, error.message);
      } else {
        Alert.alert('Success', 'Your activity is confirmed!');
        await createAppointment(user, price, activityID, 'confirmed', date, timeSlot);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process payment.');
    }
  };

  const handleActivityPress = async (activity) => {
    setSelectedActivity(activity);
    setSelectedDate(new Date());
    await fetchReservedSlots(activity.id, new Date());
    setModalVisible(true);
  };

  const handleConfirmDate = () => {
    setModalVisible(false);
    if (selectedActivity) {
      openPaymentSheet(selectedActivity.data.price, selectedActivity.id, selectedDate, selectedTimeSlot);
    }
  };

  const { data, error, isLoading, refetch, isPending } = useQuery({ queryKey: ['activities'], queryFn: getActivities });

  return (
    <View style={styles.activitiesContainer}>
      {isPending && isLoading && <ActivityIndicator />}
      {!isPending && (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 30 }}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => refetch()} />}
        >
          {data && data.map(item => (
            <Activity
              key={item.id}
              activityID={item.id}
              onPress={() => handleActivityPress(item)}
              activityTitle={item.data.title}
              activityPrice={item.data.price}
              activityDescription={item.data.description}
            />
          ))}
        </ScrollView>
      )}

      {modalVisible && (
        <Modal transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Date and Time Slot</Text>

              <View style={styles.datePickerContainer}>
                <Text style={styles.dateText}>Selected Date:</Text>
                {showDatePicker && (
                   <DateTimePicker
                     mode="date"
                     value={selectedDate}
                     minimumDate={new Date(new Date().getTime() + 24 * 60 * 60 * 1000)} 
                     onChange={(event, date) => {
                       if (date) setSelectedDate(date);
                     }}
                     style={styles.datePicker}
                   />
                )}
              </View>

              <View style={styles.timeSlotsContainer}>
                {Array.from({ length: 10 }, (_, index) => 10 + index).map(hour => {
                  if (reservedSlots.includes(hour)) return null;
                  return (
                    <Pressable
                      key={hour}
                      style={
                        selectedTimeSlot === hour
                          ? styles.selectedTimeSlot
                          : styles.timeSlot
                      }
                      onPress={() => {
                        setSelectedTimeSlot(hour);
                      }}
                    >
                      <Text style={styles.timeSlotText}>{hour}:00</Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.modalButtons}>
                <Pressable
                  style={[
                    styles.confirmButton,
                    { opacity: selectedTimeSlot === null ? 0.5 : 1 }
                  ]}
                  onPress={handleConfirmDate}
                  disabled={selectedTimeSlot === null}
                >
                  <Text style={styles.buttonText}>Confirm</Text>
                </Pressable>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

export default function TabTwoScreen() {
  const queryClient = new QueryClient();

  const [ephemeralKey, setEphemeralKey] = useState('');
  const [customerID, setCustomerID] = useState('');
  const [showEditPayment, setShowEditPayment] = useState(false);

  const displayEditPaymentInfo = async () => {
    try {
      const response = await fetch('https://getephemeralsecret-olknvoqq3q-uc.a.run.app', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const { ephemeralKey, customer } = await response.json();

      setEphemeralKey(ephemeralKey);
      setCustomerID(customer);
      setShowEditPayment(true);
    } catch (error) {
      console.error('Error fetching ephemeral key and customer info:', error);
      Alert.alert('Error', 'An error occurred while fetching payment details. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      <StripeProvider publishableKey={publicKey}>
        <SafeAreaView style={styles.containerActivities}>

          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.headingContainer}>
              <Text style={styles.title}>Book an activity</Text>

              <Pressable onPress={async () => await displayEditPaymentInfo()}>
                <Text style={{ color: '#FCAC23' }}>Edit Payment Info</Text>
              </Pressable>
            </View>

            <CustomerSheetBeta.CustomerSheet visible={showEditPayment} onResult={() => setShowEditPayment(false)} customerId={customerID} customerEphemeralKeySecret={ephemeralKey} />

            <QueryClientProvider client={queryClient}>
              <ActivityList />
            </QueryClientProvider>
          </ScrollView>

        </SafeAreaView>
      </StripeProvider>

      <BottomTabNavigator />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEDB9B',
  },
  containerActivities: {
    flex: 1,
    backgroundColor: '#FEDB9B',
    marginTop: 20,
  },
  activitiesContainer: {
    marginBottom: 30,
    backgroundColor: '#FEDB9B', 
    borderRadius: 8,
    padding: 15,
  },
  headingContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B53302', 
  },
  button: {
    backgroundColor: '#FCAC23', 
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    maxWidth: 350,
    justifyContent: 'center',
    shadowColor: '#B53302', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,

  },
  icon: {
    marginRight: 10,
  },
  scrollViewContent: {
    paddingBottom: 20, 
  },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  dateText: { fontSize: 16, marginVertical: 10 },
  modalButtons: { flexDirection: 'row', marginTop: 20 },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
  cancelButton: { backgroundColor: '#F44336', padding: 10, borderRadius: 5, marginHorizontal: 5 },
  
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20,
  },
  timeSlot: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedTimeSlot: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#388e3c',
  },
  timeSlotText: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
  },
  datePickerContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 10,
  },
  datePicker: {
    flex: 1, 
  },
});