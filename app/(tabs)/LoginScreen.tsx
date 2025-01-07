import React, { useState } from 'react'; 
import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView } from 'react-native'; 
import { Controller, useForm } from 'react-hook-form'; 
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'; 
import { initializeApp } from 'firebase/app'; 
import { getFirestore, collection, addDoc } from 'firebase/firestore'; 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth'; 
import { firebaseConfig } from '@/firebaseConfig';
import { useRouter } from 'expo-router';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '@/firebaseConfig'; // Ta configuration Firebase
import { initializeApp } from 'firebase/app';
import Header from '../screens/Header';
import BottomTabNavigator from '../screens/BottomNavigator'; 

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function AuthForm() {
  const router = useRouter(); // Pour gérer la navigation

  const [isSignIn, setIsSignIn] = useState(true); // Switch Connexion/Inscription
  const [user, setUser] = useState(null); // Définir user en tant que null ou User

  const { control, handleSubmit, getValues, reset, formState: { errors } } = useForm();

  // Fonction Inscription
  const signUp = async (data) => {
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

      await setPersistence(auth, browserLocalPersistence);

      Alert.alert('Inscription réussie', `Bienvenue ${data.firstName} !`);
      router.push('/Profile');  // Rediriger vers la page profile
      return user.uid;
    } catch (e) {
      console.error(e);
      Alert.alert('Erreur', 'Échec de l’inscription');
      return null;
    }
  };

  // Fonction Connexion
  const signIn = async (data) => {
    try {
      console.log('Tentative de connexion avec :', data.email);
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      console.log('Connexion réussie :', user);
      Alert.alert('Connexion réussie', `Bienvenue ${user.email} !`);
      router.push('/Profile');  // Rediriger vers la page profile
      return user.uid;
    } catch (e) {
      console.error('Erreur Firebase Auth :', e.code, e.message);
      Alert.alert('Erreur', `Échec de la connexion : ${e.message}`);
      return null;
    }
  };

  // Gestion de l'état de l'utilisateur (si l'utilisateur est déjà connecté)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Mettre à jour l'état de l'utilisateur
        console.log("Utilisateur déjà connecté :", currentUser);
        router.push("/Profile"); // Rediriger vers le profil
      } else {
        setUser(null); // Si l'utilisateur n'est pas connecté, réinitialiser l'état
      }
    });
    return unsubscribe; // Nettoyage de l'abonnement
  }, []);

  const submitForm = () => {
    isSignIn ? signIn(getValues()) : signUp(getValues());
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Header */}
      <Header />

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
        <TouchableOpacity style={styles.button} onPress={handleSubmit(submitForm)}>
          <Text style={styles.buttonText}>{isSignIn ? 'Se connecter' : "S'inscrire"}</Text>
        </TouchableOpacity>

        {/* Switch Connexion/Inscription */}
        <TouchableOpacity onPress={() => setIsSignIn(!isSignIn)}>
          <Text style={styles.switchText}>
            {isSignIn ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* BottomTabNavigator */}
      <BottomTabNavigator />
    </KeyboardAvoidingView>
  );
}

// Composant Principal
export default function App() {
  return (
    <AuthForm />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FECA64',
  },
  scrollContainer: {
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    color: '#B53302',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
    color: '#E97D01',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E97D01',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
    width: '100%',
    fontSize: 16,
  },
  leftAlignedContainer: {
    width: '100%',
    alignSelf: 'flex-start',
  },
  errorText: {
    color: '#B53302',
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FCAC23',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  switchText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#E97D01',
    fontSize: 14,
  },
});
