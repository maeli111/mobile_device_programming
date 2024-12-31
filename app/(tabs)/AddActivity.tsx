import React, { useState } from 'react';
import {
  Image, StyleSheet, Keyboard, SafeAreaView, TouchableWithoutFeedback, View, ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, TextInput, ScrollView
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/firebaseConfig';
import { ThemedText } from '@/components/ThemedText';
import Header from '../screens/Header'; // Assurez-vous que le fichier header.tsx est bien situé dans le bon répertoire
import BottomTabNavigator from '../screens/BottomNavigator'; // Assurez-vous que le fichier bottomNavigator.tsx est bien situé dans le bon répertoire
import 'react-native-get-random-values'; // Ajoutez ceci pour activer crypto.getRandomValues dans React Native
import { v4 as uuidv4 } from 'uuid'; // Importer uuid

// Logo
const ActivityLogo = require('../../assets/images/activity-icon.png');
const FIELD_REQUIRED = 'This field is required';

// Fonction AddActivityForm avec les ajouts demandés
function AddActivityForm() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Hook pour activer ou désactiver la requête
  const [queryEnabled, toggleQuery] = useState(false);

  // Hook pour le formulaire
  const { control, handleSubmit, getValues, reset, formState: { errors } } = useForm();

  // Fonction pour ajouter une activité à Firestore
  const addActivity = async (data: any) => {
    try {
      const customId = uuidv4(); // Générer un ID unique
  
      const res = await addDoc(collection(db, 'activities'), {
        id: customId, // Ajouter l'ID personnalisé
        title: data.activityTitle,
        description: data.activityDescription,
        duration: Number(data.activityDuration), // Durée en minutes
        price: data.activityPrice, // Nouveau champ Price
        managerName: data.managerName, // Nouveau champ Manager Name
        managerEmail: data.managerEmail, // Nouveau champ Manager Email
      });
  
      console.log('Document ajouté avec ID personnalisé :', customId);
      toggleQuery(false); // Désactiver la requête après succès
      return res.id;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  // Requête pour soumettre les données
  const { data, error, isLoading, status } = useQuery({
    queryKey: ['newActivity'],
    queryFn: () => addActivity({
      activityTitle: getValues('activityTitle'),
      activityDescription: getValues('activityDescription'),
      activityDuration: getValues('activityDuration'),
      activityPrice: getValues('activityPrice'), // Récupérer le prix
      managerName: getValues('managerName'), // Récupérer le nom du manager
      managerEmail: getValues('managerEmail'), // Récupérer l'email du manager
    }),
    enabled: queryEnabled, // La requête ne s'exécute que si queryEnabled est true
  });

  // Fonction pour gérer la soumission du formulaire
  const submitForm = () => {
    Keyboard.dismiss(); // Fermer le clavier
    toggleQuery(true);  // Activer la requête
  };

  let durationInput: TextInput | null;

  return (
    <KeyboardAvoidingView
      style={{ alignItems: 'baseline', width: '60%' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Champ Title */}
      <ThemedText type="default" style={styles.inputLabel}>Activity Title</ThemedText>
      <View style={styles.inputOuterContainer}>
        <Controller
          name="activityTitle"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onSubmitEditing={() => durationInput?.focus()}
              enterKeyHint="next"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={{ ...styles.input, ...styles.inputWithoutContainer }}
            />
          )}
        />
        {errors.activityTitle && (
          <ThemedText type="error" style={styles.inputLabel}>
            {FIELD_REQUIRED}
          </ThemedText>
        )}
      </View>

      {/* Champ Description */}
      <ThemedText type="default" style={styles.inputLabel}>Description</ThemedText>
      <View style={styles.inputOuterContainer}>
        <Controller
          name="activityDescription"
          control={control}
          rules={{ required: FIELD_REQUIRED }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={{ ...styles.input, ...styles.inputWithoutContainer }}
              multiline
            />
          )}
        />
        {errors.activityDescription && (
          <ThemedText type="error" style={styles.inputLabel}>
            {FIELD_REQUIRED}
          </ThemedText>
        )}
      </View>

      {/* Champ Duration */}
      <ThemedText type="default" style={styles.inputLabel}>Duration (in minutes)</ThemedText>
      <View style={styles.inputOuterContainer}>
        <Controller
          name="activityDuration"
          control={control}
          rules={{
            required: FIELD_REQUIRED,
            pattern: {
              value: /^[0-9]+$/,
              message: 'Only numbers are allowed',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                ref={(input) => { durationInput = input; }}
                onSubmitEditing={handleSubmit(submitForm)}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="numeric"
                style={{ ...styles.input, flex: 1 }}
              />
            </View>
          )}
        />
        {errors.activityDuration && (
          <ThemedText type="error" style={styles.inputLabel}>
            {errors.activityDuration?.message}
          </ThemedText>
        )}
      </View>

      {/* Champ Price */}
      <ThemedText type="default" style={styles.inputLabel}>Price</ThemedText>
      <View style={styles.inputOuterContainer}>
        <Controller
          name="activityPrice"
          control={control}
          rules={{
            required: FIELD_REQUIRED,
            pattern: {
              value: /^[0-9]+(\.[0-9]{1,2})?$/,
              message: 'Please enter a valid price',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="decimal-pad"
              style={{ ...styles.input, ...styles.inputWithoutContainer }}
            />
          )}
        />
        {errors.activityPrice && (
          <ThemedText type="error" style={styles.inputLabel}>
            {errors.activityPrice?.message}
          </ThemedText>
        )}
      </View>

      {/* Champ Manager Name */}
      <ThemedText type="default" style={styles.inputLabel}>Manager Name</ThemedText>
      <View style={styles.inputOuterContainer}>
        <Controller
          name="managerName"
          control={control}
          rules={{ required: FIELD_REQUIRED }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={{ ...styles.input, ...styles.inputWithoutContainer }}
            />
          )}
        />
        {errors.managerName && (
          <ThemedText type="error" style={styles.inputLabel}>
            {FIELD_REQUIRED}
          </ThemedText>
        )}
      </View>

      {/* Champ Manager Email */}
      <ThemedText type="default" style={styles.inputLabel}>Manager Email</ThemedText>
      <View style={styles.inputOuterContainer}>
        <Controller
          name="managerEmail"
          control={control}
          rules={{
            required: FIELD_REQUIRED,
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
              message: 'Please enter a valid email',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              style={{ ...styles.input, ...styles.inputWithoutContainer }}
            />
          )}
        />
        {errors.managerEmail && (
          <ThemedText type="error" style={styles.inputLabel}>
            {errors.managerEmail?.message}
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
          <ThemedText style={styles.submitText}>Add Activity</ThemedText>
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
        <Header />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.title}>
            <Image source={ActivityLogo} style={styles.logo} />
            <ThemedText type="title">Activity Form</ThemedText>
            <ThemedText type="subtitle" style={styles.subtitle}>
              Input your activity's details
            </ThemedText>
          </View>

          <QueryClientProvider client={queryClient}>
            <AddActivityForm />
          </QueryClientProvider>
        </ScrollView>

        <BottomTabNavigator />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}


// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#FEDB9B', // Utilisation d'une couleur douce pour le fond
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20, // Assurez-vous d'avoir de l'espace en bas
  },
  title: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginBottom: 15,
    marginTop:10,
  },
  subtitle: {
    marginTop: 5,
    marginBottom: 25,
    color: '#B53302', // Utilisation de la couleur #B53302 pour le sous-titre
  },
  inputLabel: {
    marginBottom: 5,
    marginLeft: 5,
    color: '#B53302', // Couleur pour les étiquettes
  },
  input: {
    paddingVertical: 13,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#FECA64', // Couleur de fond du champ de texte
    color: '#333',
    borderRadius: 10,
    width: '100%',
  },
  inputWithoutContainer: {
    borderWidth: 1,
    borderColor: '#E97D01', // Bordure en couleur #E97D01
    marginBottom: 10,
  },
  inputOuterContainer: {
    marginBottom: 20,
    width: '100%',
  },
  inputContainer: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E97D01', // Bordure en couleur #E97D01
    borderRadius: 10,
    backgroundColor: '#FCAC23', // Fond d'entrée dans un jaune doré
    color: '#333',
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  submit: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#B53302', // Bouton de soumission en couleur #B53302
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  submitText: {
    color: '#f9f9f9', // Texte du bouton en blanc
  },
  bottomContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 20,
    backgroundColor: '#E97D01', // En-tête en couleur #E97D01
  },
});
