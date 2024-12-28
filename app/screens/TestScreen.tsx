import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { auth } from '../../firebaseConfig'; // Assurez-vous que ce chemin est correct

const TestScreen = () => {
  const [firebaseConnected, setFirebaseConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour tester la connexion à Firebase
  const testFirebaseConnection = async () => {
    try {
      // On essaie de récupérer l'utilisateur courant pour vérifier la connexion
      const user = auth.currentUser;
      if (user) {
        setFirebaseConnected(true);
      } else {
        setFirebaseConnected(false);
      }
    } catch (err) {
      setError('Erreur de connexion à Firebase');
      setFirebaseConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Chargement...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : firebaseConnected ? (
        <Text style={styles.successText}>Connexion à Firebase réussie !</Text>
      ) : (
        <Text style={styles.errorText}>Échec de la connexion à Firebase</Text>
      )}

      <Button title="Tester à nouveau" onPress={testFirebaseConnection} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 20,
  },
});

export default TestScreen;
