import { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, Pressable, ActivityIndicator, Alert, ScrollView, RefreshControl, Modal } from 'react-native';
import { collection, DocumentData, getDocs, getFirestore, doc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '../../firebaseConfig.js';
import { initializeApp } from 'firebase/app';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { CustomerSheetBeta, initPaymentSheet, presentPaymentSheet, StripeProvider } from '@stripe/stripe-react-native';
import { publicKey } from '@/constants/StripePublicKey';
import Header from '../screens/Header'; 
import BottomTabNavigator from '../screens/BottomNavigator'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Activity from '@/components/Activity';
import DateTimePicker from '@react-native-community/datetimepicker';


function ActivityList() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth();

  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // Modal pour la sélection de la date
  const [selectedDate, setSelectedDate] = useState(new Date()); // Date sélectionnée, initialisée à la date actuelle
  const [isPaymentActive, setPaymentActive] = useState(false); // État du paiement
  const [paymentActiveActivityID, setPaymentID] = useState<string | null>(null); // ID d'activité pour paiement
  
  // Surveiller l'état de l'utilisateur connecté
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Utiliser les informations de l'utilisateur connecté
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // Récupérer les activités
  const getActivities = async () => {
    const res = await getDocs(collection(db, "activities"));
    let activities: DocumentData[] = [];
    res.forEach(document => {
      activities.push({ id: document.id, data: document.data() });
    });
    return activities;
  };

  // Créer un rendez-vous
  const createAppointment = async (user, price, activityID, status, date) => {
    try {
      const appointmentRef = doc(db, "appointments", `${user.email}-${Date.now()}`);
      await setDoc(appointmentRef, {
        user: user.displayName,
        email: user.email,
        price: price,
        activityID: activityID,
        status: status,
        date: date,
        customerID: user.email,
        createdAt: new Date(),
      });
      console.log('Appointment created successfully!');
    } catch (error) {
      console.error('Error creating appointment: ', error);
    }
  };

  // Obtenir l'intention de paiement
  const getPaymentIntent = async (price, activityID) => {
    try {
      if (!price || !activityID) {
        throw new Error('Missing required parameters: price or activityID');
      }

      const url = `https://getpaymentintent-olknvoqq3q-uc.a.run.app/?price=${price}&currency=eur&productID=${activityID}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const rawText = await response.text();
      if (!response.ok) {
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

  // Initialiser le paiement
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
        console.log(error);
        Alert.alert('Error', 'An error occurred while setting up the payment sheet.');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error initializing payment sheet:', error);
      Alert.alert('Error', 'Failed to initialize payment sheet. Please try again later.');
      return false;
    }
  };

  // Ouvrir le paiement
  const openPaymentSheet = async (price, activityID) => {
    if (!user) {
      Alert.alert('Error', 'You need to be logged in to make a reservation');
      return;
    }

    if (!isPaymentActive) {
      setPaymentActive(true);
      setPaymentID(activityID);

      try {
        const isInitialized = await initializePaymentSheet(price, activityID);
        if (!isInitialized) return;

        const { error } = await presentPaymentSheet();

        if (error) {
          console.log(error);
          Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
          Alert.alert('Success', 'Your activity is confirmed!');
          const date = new Date(selectedDate); // Utilisation de la date sélectionnée
          const status = 'confirmed';
          await createAppointment(user, price, activityID, status, date);
        }
      } catch (error) {
        console.error('Error during payment process:', error);
        Alert.alert('Error', 'Failed to process payment.');
      }

      setPaymentActive(false);
      setPaymentID(null);
    }
  };

  // Fonction pour gérer la sélection de la date
  const onDateChange = (event, selectedDate) => {
    setModalVisible(false); // Fermer le modal une fois la date sélectionnée
    if (selectedDate) {
      setSelectedDate(selectedDate);
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
              activePayment={paymentActiveActivityID}
              activityID={item.id}
              onPress={async () => {
                // Vérifier que la date choisie est minimum 24h après la réservation
                const currentDate = new Date();
                if (selectedDate <= currentDate.setHours(currentDate.getHours() + 24)) {
                  Alert.alert('Error', 'You must select a date at least 24 hours in advance.');
                } else {
                  setModalVisible(true); // Ouvrir le modal pour choisir la date
                }
              }}
              activityTitle={item.data.title}
              activityPrice={item.data.price}
              activityDescription={item.data.description}
            />
          ))}
        </ScrollView>
      )}

      {/* Modal pour la sélection de la date */}
      {modalVisible && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="spinner"
          onChange={onDateChange}
        />
      )}
    </View>
  );
}

export default function TabTwoScreen() {
  const queryClient = new QueryClient();

  return (
    <View style={styles.container}>
      <Header />
      <StripeProvider publishableKey={publicKey}>
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.headingContainer}>
              <Text style={styles.title}>All our activities</Text>
            </View>

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
  activitiesContainer: {
    marginBottom: 70,
    backgroundColor: '#FECA64',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#B53302',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  headingContainer: {
    gap: 3,
    marginTop: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B53302',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
});
