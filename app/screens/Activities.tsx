import { StyleSheet, SafeAreaView, View, useColorScheme, Pressable, FlatList, ActivityIndicator, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import React, { useState } from 'react';
import Activity from '@/components/Activity';
import { collection, DocumentData, getDocs, getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../../firebaseConfig.js';
import { initializeApp } from 'firebase/app';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { CustomerSheetBeta, initPaymentSheet, presentPaymentSheet, StripeProvider } from '@stripe/stripe-react-native';
import { publicKey } from '@/constants/StripePublicKey';

function ActivityList() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Modifier la fonction pour récupérer les activités
  const getActivities = async () => {
    const res = await getDocs(collection(db, "activities")); // Modifier ici pour récupérer les activités

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

    return {
      paymentIntent,
      ephemeralKey,
      customer,
      displayName
    };
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
    if (!isPaymentActive) { //only one payment can go on at a time
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
        <FlatList
          refreshing={isLoading}
          onRefresh={() => refetch()}
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Activity
              activePayment={paymentActiveActivityID}
              activityID={item.id}
              onPress={async () => await openPaymentSheet(item.data.price, item.id)}
              activityName={item.data.name}
              activityPrice={item.data.price / 100}
              activityDescription={item.data.description}
            />
          )}
        />
      )}
    </View>
  );
}

export default function TabTwoScreen() {
  const theme = useColorScheme() ?? 'light';
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
    <StripeProvider publishableKey={publicKey}>
      <SafeAreaView style={styles.container}>
        <View style={styles.headingContainer}>
          <ThemedText type="title">Your Activities</ThemedText>
          <Pressable onPress={async () => await displayEditPaymentInfo()}><ThemedText type="purpleBold">Edit Payment Info</ThemedText></Pressable>
        </View>
        <CustomerSheetBeta.CustomerSheet visible={showEditPayment} onResult={() => setShowEditPayment(false)} customerId={customerID} customerEphemeralKeySecret={ephemeralKey}></CustomerSheetBeta.CustomerSheet>
        <View>
          <QueryClientProvider client={queryClient}>
            <ActivityList />
          </QueryClientProvider>
        </View>
      </SafeAreaView>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    marginVertical: 70,
    marginHorizontal: 30,
  },
  activitiesContainer: {
    marginTop: 30,
    marginBottom: 30
  },
  headingContainer: {
    gap: 3
  },
});
