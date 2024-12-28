// /screens/Home.tsx
import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

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
        onPress={() => navigation.navigate('StripeScreen')} // Redirection vers l'écran Stripe
      />
      
      {/* Bouton Connexion */}
      <Button
        title="Connexion"
        onPress={() => navigation.navigate('LoginScreen')} // Redirection vers l'écran Connexion
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
