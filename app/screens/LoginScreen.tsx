import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { app, auth, db } from '../src/firebaseConfig'; // Modifier le chemin d'importation
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore'; // Pour Firestore

export default function App() {
  const [showOptions, setShowOptions] = useState(true); // Afficher ou masquer les options "Se connecter" et "Inscription"
  const [email, onChangeEmail] = useState(''); // État pour l'email
  const [password, onChangePassword] = useState(''); // État pour le mot de passe
  const [firstName, onChangeFirstName] = useState(''); // Prénom pour l'inscription
  const [lastName, onChangeLastName] = useState(''); // Nom pour l'inscription
  const [isSignIn, setIsSignIn] = useState(false); // Pour savoir si on est en mode connexion ou inscription
  const [messageSuccess, setMessageSuccess] = useState(''); // Nouveau state pour le message de succès

  const emailPassAuth = getAuth(app); // Utiliser l'application Firebase
  const db = getFirestore(app); // Initialiser Firestore

  // Fonction pour la connexion
  const login = async () => {
    signInWithEmailAndPassword(emailPassAuth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        setMessageSuccess('Bienvenue ' + user.email + ' !'); // Message de succès après la connexion
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert('Erreur : ' + errorMessage);
      });
  };

  // Fonction pour l'inscription et enregistrement dans Firestore
  const createUser = () => {
    createUserWithEmailAndPassword(emailPassAuth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        // Enregistrement des données supplémentaires dans Firestore
        await setDoc(doc(db, 'utilisateurs', user.uid), {
          prenom: firstName,
          nom: lastName,
          email: email,
          mdp: password,
          createdAt: new Date(),
        });

        setMessageSuccess(user.email + ' a été créé avec succès'); // Message de succès après l'inscription
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert('Erreur : ' + errorMessage);
      });
  };

  // Fonction pour vérifier si tous les champs sont remplis pour l'inscription
  const isFormValid = () => {
    return email !== '' && password !== '' && firstName !== '' && lastName !== '';
  };

  // Fonction pour vérifier si les champs sont remplis pour la connexion
  const isLoginFormValid = () => {
    return email !== '' && password !== '';
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Affichage du logo au centre */}
        <Image
          source={require('@/assets/images/rond.png')} // Remplacez par le chemin de votre logo
          style={styles.logo}
        />

        {/* Affichage du message de succès si disponible */}
        {messageSuccess ? (
          <View style={styles.successMessageContainer}>
            <Text style={styles.successMessageText}>{messageSuccess}</Text>
          </View>
        ) : null}

        {/* Affichage des options "Se connecter" et "Inscription" */}
        {showOptions && (
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={styles.optionButton} 
              onPress={() => { setIsSignIn(true); setShowOptions(false); }} // Passer en mode connexion
            >
              <Text style={styles.optionText}>Se connecter</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.optionButton} 
              onPress={() => { setIsSignIn(false); setShowOptions(false); }} // Passer en mode inscription
            >
              <Text style={styles.optionText}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Flèche pour revenir en arrière */}
        {!showOptions && (
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => setShowOptions(true)} // Revenir à l'écran principal
          >
            <Image 
              source={require('@/assets/images/fleche.png')} // Remplacez par le chemin de votre image
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        )}

        {/* Formulaire de connexion */}
        {!showOptions && isSignIn && (
          <View style={styles.formContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeEmail}
              value={email}
              placeholder="Entrez votre email"
            />

            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangePassword}
              value={password}
              secureTextEntry={true}
              placeholder="Entrez votre mot de passe"
            />

            <TouchableOpacity 
              style={[styles.optionButton, { backgroundColor: isLoginFormValid() ? '#808080' : '#D3D3D3' }]} 
              onPress={login}
              disabled={!isLoginFormValid()} // Désactive le bouton si le formulaire n'est pas valide
            >
              <Text style={styles.optionText}>OK</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Formulaire d'inscription */}
        {!showOptions && !isSignIn && (
          <View style={styles.formContainer}>
            <Text style={styles.label}>Prénom</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeFirstName}
              value={firstName}
              placeholder="Entrez votre prénom"
            />

            <Text style={styles.label}>Nom</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeLastName}
              value={lastName}
              placeholder="Entrez votre nom"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeEmail}
              value={email}
              placeholder="Entrez votre email"
            />

            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangePassword}
              value={password}
              secureTextEntry={true}
              placeholder="Entrez votre mot de passe"
            />

            <TouchableOpacity 
              style={[styles.optionButton, { backgroundColor: isFormValid() ? '#808080' : '#D3D3D3' }]} 
              onPress={createUser}
              disabled={!isFormValid()} // Désactive le bouton si le formulaire n'est pas valide
            >
              <Text style={styles.optionText}>OK</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003366', // Bleu marine
  },
  scrollContainer: {
    justifyContent: 'center', // Centrer verticalement
    alignItems: 'center', // Centrer horizontalement
    paddingBottom: 20, // Ajouter un peu d'espace en bas
  },
  logo: {
    width: 150,    // Largeur du logo
    height: 150,   // Hauteur du logo
    marginBottom: 50, // Espacement entre le logo et les boutons
    marginTop: 70,
  },
  successMessageContainer: {
    backgroundColor: '#FFCCE5', // Fond rose clair
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  successMessageText: {
    color: '#D50000', // Texte rouge foncé
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionButton: {
    backgroundColor: '#808080', // Couleur de fond des boutons d'options
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 10, // Espacement entre les boutons
    width: '80%', // Les boutons occupent 80% de la largeur de l'écran
    alignItems: 'center', // Centrer le texte à l'intérieur du bouton
  },
  optionText: {
    color: '#FFFFFF', // Couleur du texte des boutons
    fontSize: 18,
    textAlign: 'center', // Centrer le texte dans le bouton
  },
  optionsContainer: {
    marginTop: 20, // Espacement entre le logo et les options
    width: '100%', // Pour que les boutons occupent toute la largeur
    alignItems: 'center', // Centrer les boutons dans la vue
  },
  formContainer: {
    marginTop: 20,
    width: '80%',
    marginLeft: 70,  // Décalage des libellés à gauche
    alignItems: 'flex-start', // Aligner les éléments à gauche
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    width: '80%',  // Largeur du champ de saisie
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  arrowButton: {
    marginTop: 20, // Espacement depuis le haut pour être juste au-dessus du formulaire
    marginLeft: 70,  // Décalage des libellés à gauche
    alignSelf: 'flex-start', // Aligner la flèche à gauche
    zIndex: 1, // S'assurer que la flèche soit au-dessus du formulaire
  },
  arrowIcon: {
    width: 30, 
    height: 30, // Taille de la flèche
  }
});
