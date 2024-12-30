import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; // Remplacer useNavigate par useRouter

const Home = () => {
  const router = useRouter(); // Utiliser useRouter pour la navigation

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/rond.png')} // Assurez-vous d'avoir un logo dans votre dossier assets
        style={styles.logo}
      />
      <Text style={styles.title}>Bienvenue sur notre application !</Text>
      
      {/* Bouton Stripe */}
      <Button
        title="Stripe"
        onPress={() => router.push('../screens/StripeScreen')} // Utiliser router.push avec le chemin
      />
      
      {/* Bouton Connexion */}
      <Button
        title="Connexion"
        onPress={() => router.push('../login')} // Utiliser router.push avec le chemin
      />
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
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
});

export default Home;
