import { StyleSheet, SafeAreaView, View, Text, Pressable, ActivityIndicator, Alert, ScrollView, RefreshControl  } from 'react-native';
import React, { useState } from 'react';
import Activity from '@/components/Activity';
import { collection, DocumentData, getDocs, getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../../firebaseConfig.js';
import { initializeApp } from 'firebase/app';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { CustomerSheetBeta, initPaymentSheet, presentPaymentSheet, StripeProvider } from '@stripe/stripe-react-native';
import { publicKey } from '@/constants/StripePublicKey';
import Header from '../screens/Header'; // Assurez-vous que le fichier header.tsx est bien situé dans le bon répertoire
import BottomTabNavigator from '../screens/BottomNavigator'; // Assurez-vous que le fichier bottomNavigator.tsx est bien situé dans le bon répertoire

function ActivityList() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Fonction pour récupérer les activités
  const getActivities = async () => {
    const res = await getDocs(collection(db, "activities"));
    let activities: DocumentData[] = [];
    res.forEach(document => {
      activities.push({ id: document.id, data: document.data() });
    });
    return activities;
  };

  const getPaymentIntent = async (price: number, activityID: string) => {
    const response = await fetch(`https://getpaymentintent-olknvoqq3q-uc.a.run.app/?price=${price}&currency=eur&activityID=${activityID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { paymentIntent, ephemeralKey, customer, displayName } = await response.json();

    return { paymentIntent, ephemeralKey, customer, displayName };
  };

  const initializePaymentSheet = async (price: number, activityID: string) => {
    const { paymentIntent, ephemeralKey, customer, displayName } = await getPaymentIntent(price, activityID);

    const { error } = await initPaymentSheet({
      merchantDisplayName: displayName,
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
    });

    if (error) {
      console.log(error);
      Alert.alert('Error', 'An error has occurred while setting up your payment. Please try again later.');
    }
  };

  const openPaymentSheet = async (price: number, activityID: string) => {
    if (!isPaymentActive) {
      setPaymentActive(true);
      setPaymentID(activityID);

      await initializePaymentSheet(price, activityID);
      const { error } = await presentPaymentSheet();

      if (error) {
        console.log(error);
        Alert.alert(`Error code: ${error.code}`, error.message);
      } else {
        Alert.alert('Success', 'Your activity is confirmed!');
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
              onPress={async () => await openPaymentSheet(item.data.price, item.id)}
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
      <StripeProvider publishableKey={publicKey}>
        <SafeAreaView style={styles.container}>
          {/* Ajouter le Header */}
          <Header />

          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.headingContainer}>
              <Text style={styles.title}>All our activities</Text>
              
              <Pressable onPress={async () => await displayEditPaymentInfo()}>
                <Text style={{ color: '#FCAC23' }}>Edit Payment Info</Text>
              </Pressable>
            </View>

            <CustomerSheetBeta.CustomerSheet visible={showEditPayment} onResult={() => setShowEditPayment(false)} customerId={customerID} customerEphemeralKeySecret={ephemeralKey} />

            {/* Contenu des activités */}
            <QueryClientProvider client={queryClient}>
              <ActivityList />
            </QueryClientProvider>
          </ScrollView>

          {/* Ajouter le BottomTabNavigator */}
          <BottomTabNavigator />
        </SafeAreaView>
      </StripeProvider>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEDB9B', // Utilisation de la couleur beige clair comme fond principal
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
