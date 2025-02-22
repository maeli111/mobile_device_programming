import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from '@/firebaseConfig';
import { useRouter } from 'expo-router';
import Header from '../screens/Header';
import BottomTabNavigator from '../screens/BottomNavigator';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

function AuthForm() {
  const router = useRouter();

  const [isSignIn, setIsSignIn] = useState(true);
  const [queryEnabled, setQueryEnabled] = useState(false);

  const { control, handleSubmit, getValues, reset, formState: { errors } } = useForm();

  const signUp = async (data: any) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      console.log("User created:", user);

      const userDoc = await addDoc(collection(db, 'users'), {
        uid: user.uid,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        createdAt: new Date(),
      });

      console.log("Document added with ID:", userDoc.id);

      Alert.alert('Registration successful', `Welcome ${data.firstName}!`);
      router.push('/Profile'); 
      return user.uid;
    } catch (e: any) {
      console.error("Registration error:", e.message);
      Alert.alert('Error', `Registration failed: ${e.message}`);
      return null;
    }
  };

  const signIn = async (data: any) => {
    try {
      console.log('Attempting to connect with:', data.email);
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      console.log('Connection successful:', user);
      Alert.alert('Connection successful', `Welcome ${user.email}!`);
      router.push('/Profile');  
      return user.uid;
    } catch (e: any) {
      console.error('Firebase Auth Error:', e.message);
      Alert.alert('Error', `Login failed: ${e.message}`);
      return null;
    }
  };

  const { isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: () => (isSignIn ? signIn(getValues()) : signUp(getValues())),
    enabled: queryEnabled,
    onSettled: () => setQueryEnabled(false),
  });

  const submitForm = () => {
    setQueryEnabled(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{isSignIn ? 'Login' : 'Register'}</Text>

        {!isSignIn && (
          <>
            <Text style={styles.label}>First Name</Text>
            <Controller
              name="firstName"
              control={control}
              rules={{ required: !isSignIn }}
              render={({ field: { onChange, value } }) => (
                <TextInput style={styles.input} onChangeText={onChange} value={value} placeholder="Enter your first name" />
              )}
            />
            {errors.firstName && <Text style={styles.errorText}>This field is required</Text>}

            <Text style={styles.label}>Last Name</Text>
            <Controller
              name="lastName"
              control={control}
              rules={{ required: !isSignIn }}
              render={({ field: { onChange, value } }) => (
                <TextInput style={styles.input} onChangeText={onChange} value={value} placeholder="Enter your last name" />
              )}
            />
            {errors.lastName && <Text style={styles.errorText}>This field is required</Text>}
          </>
        )}

        <View style={styles.leftAlignedContainer}>
          <Text style={styles.label}>Email</Text>
          <Controller
            name="email"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} onChangeText={onChange} value={value} placeholder="Enter your email" />
            )}
          />
          {errors.email && <Text style={styles.errorText}>Email is required</Text>}

          <Text style={styles.label}>Password</Text>
          <Controller
            name="password"
            control={control}
            rules={{ required: true, minLength: 6 }}
            render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} secureTextEntry onChangeText={onChange} value={value} placeholder="Password" />
            )}
          />
          {errors.password && <Text style={styles.errorText}>Password must contain at least 6 characters</Text>}
        </View>

        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSubmit(submitForm)}>
            <Text style={styles.buttonText}>{isSignIn ? 'Log in' : 'Register'}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => setIsSignIn(!isSignIn)}>
          <Text style={styles.switchText}>
            {isSignIn ? "No account yet? Sign up" : 'Already have an account? Log in'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomTabNavigator />
    </KeyboardAvoidingView>
  );
}

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
    backgroundColor: '#FEDB9B',
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
