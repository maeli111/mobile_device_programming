import { StyleSheet, SafeAreaView, View, Text, Pressable, ActivityIndicator, Alert, ScrollView, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
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

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [currentActivityID, setCurrentActivityID] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [user, setUser] = useState(null);

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

  const getActivities = async () => {
    const res = await getDocs(collection(db, "activities"));
    return res.docs.map(doc => ({ id: doc.id, data: doc.data() }));
  };

  const createAppointment = async (user, price, activityID, status, date) => {
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
        date,
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

  const openPaymentSheet = async (price, activityID) => {
    if (!isPaymentActive) {
      setPaymentActive(true);
      setPaymentID(activityID);
      try {
        const isInitialized = await initializePaymentSheet(price, activityID);
        if (!isInitialized) return;
        const { error } = await presentPaymentSheet();
        if (error) {
          Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
          Alert.alert('Success', 'Your activity is confirmed!');
          await createAppointment(user, price, activityID, 'confirmed', new Date());
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to process payment.');
      }
      setPaymentActive(false);
      setPaymentID(null);
    }
  };

  const [isPaymentActive, setPaymentActive] = useState(false);
  const [paymentActiveActivityID, setPaymentID] = useState(null);

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
              activePayment={paymentActiveActivityID}
              activityID={item.id}
              onPress={async () => {
                try {
                  await openPaymentSheet(item.data.price, item.id);
                } catch (error) {
                  console.error('Error during activity payment:', error);
                }
              }}
              activityTitle={item.data.title}
              activityPrice={item.data.price}
              activityDescription={item.data.description}
            />
          ))}
        </ScrollView>
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
      const response = await fetch(`https://getephemeralsecret-olknvoqq3q-uc.a.run.app`, {
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
              <Text style={styles.title}>All our activities</Text>

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
    backgroundColor: '#FEDB9B', // Utilisation de la couleur beige clair comme fond principal
  },
  containerActivities: {
    flex: 1,
    backgroundColor: '#FEDB9B', 
    marginTop: 20,
  },
  activitiesContainer: {
    marginBottom: 30,
    backgroundColor: '#FECA64', // Utilisation de la couleur jaune pâle pour les activités
    borderRadius: 8,
    padding: 15,
    shadowColor: '#B53302', // Ombre rouge foncé pour ajouter un effet subtil
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  headingContainer: {
    gap: 3,
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 20, // Espacement sous le titre
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B53302', // Utilisation du rouge foncé pour le titre
  },
  button: {
    backgroundColor: '#FCAC23', // Utilisation du jaune doré pour les boutons
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    maxWidth: 350,
    justifyContent: 'center',
    shadowColor: '#B53302', // Ombre rouge foncé pour l'effet de profondeur
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  scrollViewContent: {
    paddingBottom: 20, // Evite que le contenu soit collé en bas
  },
});
