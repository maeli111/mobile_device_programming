import React, { useState } from 'react'; 
import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView } from 'react-native'; 
import { Controller, useForm } from 'react-hook-form'; 
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'; 
import { initializeApp } from 'firebase/app'; 
import { getFirestore, collection, addDoc } from 'firebase/firestore'; 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'; 
import { firebaseConfig } from '@/firebaseConfig';
import { useRouter } from 'expo-router';
import Header from '../screens/Header'; // Assurez-vous que le fichier header.tsx est bien situé dans le bon répertoire
import BottomTabNavigator from '../screens/BottomNavigator'; // Assurez-vous que le fichier bottomNavigator.tsx est bien situé dans le bon répertoire

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

function AuthForm() {
  const router = useRouter(); // Pour gérer la navigation

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
      router.push('/Profile');  // Rediriger vers la page profile
      return user.uid;
    } catch (e) {
      console.error(e);
      Alert.alert('Erreur', 'Échec de l’inscription');
      return null;
    }
  };

  // Fonction Connexion
  const signIn = async (data: any) => {
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
      
      {/* BottomTabNavigator */}
      <BottomTabNavigator />
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FECA64', // Utilisation d'une couleur principale
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
    color: '#B53302', // Utilisation de la couleur primaire pour le titre
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
    color: '#E97D01', // Mise à jour pour avoir la même couleur que "Pas encore de compte ?"
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
    color: '#B53302', // Couleur d'erreur
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
    color: '#E97D01', // Couleur de "Pas encore de compte ?"
    fontSize: 14,
  },
});
