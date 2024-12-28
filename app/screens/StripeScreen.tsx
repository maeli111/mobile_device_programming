import React, { useState } from 'react';
import {
  Image, StyleSheet, Keyboard, SafeAreaView, TouchableWithoutFeedback, View, ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, TextInput,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/firebaseConfig';
import { ThemedText } from '@/components/ThemedText';

const StripeLogo = require('../../assets/images/stripe-icon.jpeg');
const FIELD_REQUIRED = 'This field is required';

// Fonction AddProductForm avec les ajouts demandés
function AddProductForm() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Hook pour activer ou désactiver la requête
  const [queryEnabled, toggleQuery] = useState(false);

  // Hook pour le formulaire
  const { control, handleSubmit, getValues, reset, formState: { errors } } = useForm();

  // Fonction pour ajouter un produit à Firestore
  const addProduct = async (data: any) => {
    try {
      const res = await addDoc(collection(db, 'products'), {
        name: data.productName,
        price: Number(data.productPrice) * 100, // Conversion en centimes
      });
      toggleQuery(false); // Désactiver la requête après succès
      return res.id;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  // Requête pour soumettre les données
  const { data, error, isLoading, status } = useQuery({
    queryKey: ['newProduct'],
    queryFn: () => addProduct({
      productName: getValues('productName'),
      productPrice: getValues('productPrice'),
    }),
    enabled: queryEnabled, // La requête ne s'exécute que si queryEnabled est true
  });

  // Fonction pour gérer la soumission du formulaire
  const submitForm = () => {
    Keyboard.dismiss(); // Fermer le clavier
    toggleQuery(true);  // Activer la requête
  };

  let priceInput: TextInput | null;

  return (
    <KeyboardAvoidingView
      style={{ alignItems: 'baseline', width: '60%' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Champ Name */}
      <ThemedText type="default" style={styles.inputLabel}>Name</ThemedText>
      <View style={styles.inputOuterContainer}>
        <Controller
          name="productName"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onSubmitEditing={() => priceInput?.focus()}
              enterKeyHint="next"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={{ ...styles.input, ...styles.inputWithoutContainer }}
            />
          )}
        />
        {errors.productName && (
          <ThemedText type="error" style={styles.inputLabel}>
            This field is required
          </ThemedText>
        )}
      </View>

      {/* Champ Price */}
      <ThemedText type="default" style={styles.inputLabel}>Price</ThemedText>
      <View style={styles.inputOuterContainer}>
        <Controller
          name="productPrice"
          control={control}
          rules={{
            required: FIELD_REQUIRED,
            pattern: {
              value: /^[1-9][0-9]*(\.[0-9]{2})?$/,
              message: 'Invalid price',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <ThemedText style={{ ...styles.inputPrefix, color: Colors.light.text }}>
                €
              </ThemedText>
              <TextInput
                ref={(input) => { priceInput = input; }}
                onSubmitEditing={handleSubmit(submitForm)}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                enterKeyHint="done"
                keyboardType="decimal-pad"
                style={{ ...styles.input, flex: 1 }}
              />
            </View>
          )}
        />
        {errors.productPrice && (
          <ThemedText type="error" style={styles.inputLabel}>
            {errors.productPrice?.message}
          </ThemedText>
        )}
      </View>

      {/* Indicateurs et bouton de soumission */}
      <View style={styles.bottomContainer}>
        {isLoading && <ActivityIndicator />}
        {status === 'success' && data !== null && (
          <Ionicons name="checkmark-sharp" size={25} color="green" />
        )}
        {status === 'error' || (status === 'success' && data === null) && (
          <Ionicons name="alert-circle" size={25} color="red" />
        )}
        <Pressable
          disabled={isLoading}
          style={styles.submit}
          onPress={handleSubmit(submitForm)}
        >
          <ThemedText style={styles.submitText}>Add Product</ThemedText>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

// Fonction principale HomeScreen
export default function HomeScreen() {
  const queryClient = new QueryClient();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.title}>
          <Image source={StripeLogo} style={styles.logo} />
          <ThemedText type="title">Stripe Tutorial</ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Input your product's details
          </ThemedText>
        </View>

        <QueryClientProvider client={queryClient}>
          <AddProductForm />
        </QueryClientProvider>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginBottom: 25,
  },
  subtitle: {
    marginTop: 5,
    marginBottom: 25,
  },
  inputLabel: {
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    paddingVertical: 13,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
    borderRadius: 10,
    width: '100%',
  },
  inputWithoutContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  inputOuterContainer: {
    marginBottom: 20,
    width: '100%',
  },
  inputContainer: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    color: '#333',
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  inputPrefix: {
    paddingLeft: 10,
  },
  submit: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#635DF6',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  submitText: {
    color: '#f9f9f9',
  },
  bottomContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
  },
});