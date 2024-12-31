import React, { useState } from 'react';  
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Pour l'icône de confirmation
import Header from '../screens/Header';
import BottomTabNavigator from '../screens/BottomNavigator';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, fetchSignInMethodsForEmail } from 'firebase/auth';
import { firebaseConfig } from '@/firebaseConfig'; 

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export default function ValidateActivity() {
  const [activityId, setActivityId] = useState('');
  const [isValid, setIsValid] = useState(null); // null: pas vérifié, true: valide, false: invalide
  const [managerEmail, setManagerEmail] = useState(''); // Stocke l'email du manager
  const [isManagerAuthenticated, setIsManagerAuthenticated] = useState(null); // État pour l'authentification du manager
  const [isLoading, setIsLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState(''); // Message de validation
  const [authMessage, setAuthMessage] = useState(''); // Message d'authentification

  // Fonction pour vérifier si l'ID existe et récupérer l'email du manager
  const handleValidate = async () => {
    setIsLoading(true);
    setIsValid(null);
    setManagerEmail('');
    setIsManagerAuthenticated(null);
    setValidationMessage('');
    setAuthMessage('');

    try {
      const querySnapshot = await getDocs(collection(db, 'activities'));
      let found = false;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.id === activityId) {
          found = true;
          setManagerEmail(data.managerEmail || 'Email non disponible');
        }
      });

      if (found) {
        setIsValid(true);
        setValidationMessage("✅ L'ID existe bien dans la base de données !");
        await checkManagerAuthentication();
      } else {
        setIsValid(false);
        setValidationMessage("❌ Aucune activité trouvée avec cet ID.");
      }
    } catch (e) {
      console.error("Erreur lors de la vérification de l'activité :", e);
      setValidationMessage("⚠️ Une erreur est survenue lors de la vérification.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour vérifier si l'email du manager est authentifié
  const checkManagerAuthentication = async () => {
    if (!managerEmail || managerEmail === 'Email non disponible') return;

    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, managerEmail);
      if (signInMethods.length > 0) {
        setIsManagerAuthenticated(true);
        setAuthMessage("✅ Le manager est déjà authentifié.");
      } else {
        setIsManagerAuthenticated(false);
        setAuthMessage("❌ Le manager n'est pas authentifié.");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'authentification :", error);
      setAuthMessage("⚠️ Impossible de vérifier l'authentification du manager.");
    }
  };

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text style={styles.title}>Vérifier une activité</Text>

        {/* Champ pour l'ID de l'activité */}
        <Text style={styles.label}>ID de l'activité</Text>
        <TextInput
          style={[
            styles.input,
            isValid === true ? styles.validInput : isValid === false ? styles.invalidInput : null,
          ]}
          placeholder="Entrez l'ID de l'activité"
          value={activityId}
          onChangeText={(text) => {
            setActivityId(text);
            setIsValid(null); 
            setManagerEmail('');
            setIsManagerAuthenticated(null);
            setValidationMessage('');
            setAuthMessage('');
          }}
          keyboardType="default"
        />

        {/* Bouton de validation */}
        <Button 
          title={isLoading ? "Vérification en cours..." : "Vérifier l'ID"} 
          onPress={handleValidate} 
          disabled={isLoading || activityId === ''}
        />

        {/* Affichage des messages de validation */}
        {validationMessage !== '' && (
          <Text 
            style={[
              styles.validationMessage, 
              isValid ? styles.validText : styles.invalidText
            ]}
          >
            {validationMessage}
          </Text>
        )}

        {/* Icônes de validation */}
        {isValid === true && (
          <Ionicons name="checkmark-circle" size={30} color="green" style={styles.icon} />
        )}
        {isValid === false && (
          <Ionicons name="close-circle" size={30} color="red" style={styles.icon} />
        )}

        {/* Affichage de l'email du manager */}
        {isValid === true && managerEmail !== '' && (
          <Text style={styles.managerEmail}>
            📧 Email du manager : {managerEmail}
          </Text>
        )}

        {/* Affichage de l'état d'authentification */}
        {authMessage !== '' && (
          <Text 
            style={[
              styles.authMessage, 
              isManagerAuthenticated ? styles.validText : styles.invalidText
            ]}
          >
            {authMessage}
          </Text>
        )}
      </View>
      <BottomTabNavigator />
    </>
  );
}

// ✅ **Styles**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FEDB9B',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#B53302',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B53302',
    alignSelf: 'flex-start',
    marginBottom: 5,
    width: '100%',
  },
  input: {
    padding: 10,
    fontSize: 16,
    backgroundColor: '#FECA64',
    borderRadius: 10,
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E97D01',
  },
  validInput: { borderColor: 'green' },
  invalidInput: { borderColor: 'red' },
  validationMessage: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  authMessage: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  validText: { color: 'green' },
  invalidText: { color: 'red' },
  icon: { marginTop: 20 },
  managerEmail: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});
