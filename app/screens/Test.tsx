import React, { useState } from 'react';  
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Pour l'icône de confirmation
import Header from '../screens/Header'; // Assurez-vous que le fichier header.tsx est bien situé dans le bon répertoire
import BottomTabNavigator from '../screens/BottomNavigator'; // Assurez-vous que le fichier bottomNavigator.tsx est bien situé dans le bon répertoire
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/firebaseConfig'; // Assurez-vous d'avoir votre fichier firebaseConfig

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function DeleteActivity() {
  const [activityId, setActivityId] = useState('');
  const [password, setPassword] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  // Fonction pour vérifier et supprimer une activité depuis Firestore
  const handleDelete = async () => {
    try {
      // Vérifier si l'activité existe dans Firestore
      const activitiesRef = doc(db, 'activities', activityId); // On utilise 'activityId' pour accéder au document
      const activitySnap = await getDoc(activitiesRef);

      if (!activitySnap.exists()) {
        Alert.alert("Erreur", "Aucune activité trouvée avec cet ID.");
        return;
      }

      const activityData = activitySnap.data();
      
      // Vérifier que le mot de passe correspond à celui de l'utilisateur
      if (password === activityData.password) {
        // Supprimer l'activité de Firestore
        await deleteDoc(activitiesRef);
        setIsDeleted(true);
        setIsConfirmed(true);
        Alert.alert("Success", `L'activité avec l'ID ${activityId} a été supprimée avec succès.`);
      } else {
        Alert.alert("Erreur", "Le mot de passe est incorrect.");
      }
    } catch (e) {
      console.error("Erreur lors de la suppression de l'activité :", e);
      Alert.alert("Erreur", "Une erreur est survenue lors de la suppression de l'activité.");
    }
  };

  // Si l'activité est supprimée avec succès, affichez une icône ou un message
  const renderSuccessMessage = () => {
    if (isDeleted) {
      return <Ionicons name="checkmark-sharp" size={25} color="green" />;
    }
    return null;
  };

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text style={styles.title}>Supprimer une activité</Text>

        {/* Label pour l'ID de l'activité */}
        <Text style={styles.label}>ID de l'activité</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez l'ID de l'activité"
          value={activityId}
          onChangeText={setActivityId}
          keyboardType="default"  // Modifier ici pour accepter tout type de texte
        />

        {/* Label pour le mot de passe */}
        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrez votre mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button title="Confirmer la suppression" onPress={handleDelete} />

        {isConfirmed && (
          <View style={styles.confirmationContainer}>
            <Text style={styles.confirmationText}>Êtes-vous sûr de vouloir supprimer cette activité ?</Text>
            <Button title="Confirmer" onPress={handleDelete} />
          </View>
        )}

        {renderSuccessMessage()}

        {isDeleted && (
          <Text style={styles.successText}>Suppression réussie ! ✅</Text>
        )}
      </View>
      <BottomTabNavigator />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FEDB9B', // Fond de couleur douce
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#B53302', // Couleur de texte pour le titre
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B53302', // Couleur des labels
    alignSelf: 'flex-start', // Pour aligner les labels à gauche
    marginBottom: 5, // Espacement entre le label et l'input
    width: '100%',
  },
  input: {
    paddingVertical: 13,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#FECA64', // Fond des champs de texte
    color: '#333',
    borderRadius: 10,
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E97D01', // Bordure de couleur
  },
  confirmationContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  confirmationText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#B53302', // Texte de confirmation
  },
  successText: {
    fontSize: 18,
    color: 'green',
    marginTop: 20,
    fontWeight: 'bold',
  },
});
