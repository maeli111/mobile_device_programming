import { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, Pressable, ActivityIndicator, Alert, ScrollView, RefreshControl } from 'react-native';
import { collection, DocumentData, getDocs, getFirestore, doc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '../../firebaseConfig.js';
import { initializeApp } from 'firebase/app';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { CustomerSheetBeta, initPaymentSheet, presentPaymentSheet, StripeProvider } from '@stripe/stripe-react-native';
import { publicKey } from '@/constants/StripePublicKey';
import Header from '../screens/Header'; // Assurez-vous que le fichier header.tsx est bien situé dans le bon répertoire
import BottomTabNavigator from '../screens/BottomNavigator'; // Assurez-vous que le fichier bottomNavigator.tsx est bien situé dans le bon répertoire
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Activity from '@/components/Activity';


function ActivityList() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth();

  const [user, setUser] = useState(null);

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

  // Fonction pour récupérer les activités
  const getActivities = async () => {
    const res = await getDocs(collection(db, "activities"));
    let activities: DocumentData[] = [];
    res.forEach(document => {
      activities.push({ id: document.id, data: document.data() });
    });
    return activities;
  };

  // Fonction pour créer un rendez-vous dans la collection "appointments"
  const createAppointment = async (user, price, activityID, status, date) => {
    try {
      const appointmentRef = doc(db, "appointments", `${user.email}-${Date.now()}`); // Utilisation d'un ID unique basé sur l'email et un timestamp
      await setDoc(appointmentRef, {
        user: user.displayName, // Utilisation du nom de l'utilisateur connecté
        email: user.email, // Utilisation de l'email de l'utilisateur connecté
        price: price,
        activityID: activityID,
        status: status,
        date: date,
        customerID: user.email, // Utilisation de l'email pour lier le rendez-vous à un utilisateur
        createdAt: new Date(),
      });
      console.log('Appointment created successfully!');
    } catch (error) {
      console.error('Error creating appointment: ', error);
    }
  };
    

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
      console.log('Raw Response:', rawText);

      if (!response.ok) {
        console.error(`Error from server: ${response.status} - ${rawText}`);
        throw new Error(`Server returned error: ${response.status}`);
      }

      const { paymentIntent, ephemeralKey, customer, displayName } = JSON.parse(rawText);

      if (!paymentIntent || !ephemeralKey || !customer || !displayName) {
        throw new Error('Invalid response structure from server.');
      }

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

          const date = new Date();
          const status = 'confirmed';
          await createAppointment(user, price, activityID, status, date, user.email);
        }
      } catch (error) {
        console.error('Error during payment process:', error);
        Alert.alert('Error', 'Failed to process payment.');
      }

      setPaymentActive(false);
      setPaymentID(null);
    }
  };

  const [isPaymentActive, setPaymentActive] = useState(false);
  const [paymentActiveActivityID, setPaymentID] = useState<string | null>(null);

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
              onPress={async () => await openPaymentSheet(item.data.price, item.id)} // Ne passe pas de nom ou email statique, mais utilise l'utilisateur connecté
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
  };

  return (
    <View style={styles.container}>
      <Header />
      <StripeProvider publishableKey={publicKey}>
        <SafeAreaView style={styles.container}>
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

          <BottomTabNavigator />
        </SafeAreaView>
      </StripeProvider>
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
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
});
