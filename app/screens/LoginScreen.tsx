import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from '@/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

// ✅ Initialisation Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ Composant de formulaire
function AuthForm() {
  const navigation = useNavigation();

  const [isSignIn, setIsSignIn] = useState(true); // Switch Connexion/Inscription
  const [queryEnabled, setQueryEnabled] = useState(false);

  const { control, handleSubmit, getValues, reset, formState: { errors } } = useForm();
  
  // Fonction Inscription
  const signUp = async (data: any) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        createdAt: new Date(),
      });

      Alert.alert('Inscription réussie', `Bienvenue ${data.firstName} !`);
      navigation.navigate('NavigationScreen'); // ✅ Redirection vers HomeScreen
      return user.uid;
    } 
    
    catch (e) {
      console.error(e);
      Alert.alert('Erreur', 'Échec de l’inscription');
      return null;
    }
  };

  // Fonction Connexion
  const signIn = async (data: any) => {
    try {
      console.log("Tentative de connexion avec :", data.email);
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      console.log("Connexion réussie :", user);
      Alert.alert('Connexion réussie', `Bienvenue ${user.email} !`);      
      navigation.navigate('NavigationScreen');
      return user.uid;
    } 
    
    catch (e) {
      console.error("Erreur Firebase Auth :", e.code, e.message);
      Alert.alert('Erreur', `Échec de la connexion : ${e.message}`);
      return null;
    }
  };
  

  const { isLoading, status } = useQuery({
    queryKey: ['auth'],
    queryFn: () => (isSignIn ? signIn(getValues()) : signUp(getValues())),
    enabled: queryEnabled,
  });

  const submitForm = () => {
    setQueryEnabled(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{isSignIn ? 'Connexion' : 'Inscription'}</Text>

        {/* Champs Prénom et Nom */}
        {!isSignIn && (
          <>
            <Text style={styles.label}>Prénom</Text>
            <Controller
              name="firstName"
              control={control}
              rules={{ required: !isSignIn }}
              render={({ field: { onChange, value } }) => (
                <TextInput style={styles.input} onChangeText={onChange} value={value} placeholder="Entrez votre prénom" />
              )}
            />
            {errors.firstName && <Text style={styles.errorText}>Ce champ est requis</Text>}
            
            <Text style={styles.label}>Nom</Text>
            <Controller
              name="lastName"
              control={control}
              rules={{ required: !isSignIn }}
              render={({ field: { onChange, value } }) => (
                <TextInput style={styles.input} onChangeText={onChange} value={value} placeholder="Entrez votre nom" />
              )}
            />
            {errors.lastName && <Text style={styles.errorText}>Ce champ est requis</Text>}
          </>
        )}

        {/* Champs Email et Mot de Passe alignés à gauche */}
        <View style={styles.leftAlignedContainer}>
          <Text style={styles.label}>Email</Text>
          <Controller
            name="email"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} onChangeText={onChange} value={value} placeholder="Entrez votre email" />
            )}
          />
          {errors.email && <Text style={styles.errorText}>L'email est requis</Text>}

          <Text style={styles.label}>Mot de passe</Text>
          <Controller
            name="password"
            control={control}
            rules={{ required: true, minLength: 6 }}
            render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} secureTextEntry onChangeText={onChange} value={value} placeholder="Mot de passe" />
            )}
          />
          {errors.password && <Text style={styles.errorText}>Le mot de passe doit contenir au moins 6 caractères</Text>}
        </View>

        {/* Bouton de soumission */}
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSubmit(submitForm)}>
            <Text style={styles.buttonText}>{isSignIn ? 'Se connecter' : "S'inscrire"}</Text>
          </TouchableOpacity>
        )}

        {/* Switch Connexion/Inscription */}
        <TouchableOpacity onPress={() => setIsSignIn(!isSignIn)}>
          <Text style={styles.switchText}>
            {isSignIn ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ✅ Composant Principal
export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthForm />
    </QueryClientProvider>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
    width: '100%',
  },
  leftAlignedContainer: {
    width: '100%',
    alignSelf: 'flex-start',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  switchText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#007BFF',
  },
});
