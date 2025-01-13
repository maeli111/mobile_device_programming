import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity, StyleSheet, View, Text, TextInput, FlatList, useColorScheme, Pressable, ActivityIndicator, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, deleteField } from "firebase/firestore"; 

// Firestore instance
const db = getFirestore();

export type ActivityProps = PressableProps & {
  activityTitle: string;
  activityPrice: number;
  activityDescription: string;
  activePayment: string | null;
  activityID: string;
};

export default function Activity({
  activityTitle,
  activityPrice,
  activityDescription,
  onPress,
  activePayment,
  activityID,
  ...rest
}: ActivityProps) {
  const theme = useColorScheme() ?? 'light';

  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState(null);
  const [numberOfReviews, setNumberOfReviews] = useState(0);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState("");


  const auth = getAuth();

  // Vérifie si l'utilisateur est connecté et charge les favoris
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      checkIfFavorite(currentUser.email);
    }
    // Charger la note et le nombre d'avis de l'activité
    const fetchActivityDetails = async () => {
      try {
        const docRef = doc(db, "activities", activityID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setRating(data.rating || 0); // Utiliser 0 si aucune note n'est donnée
          setNumberOfReviews(data.numberOfReviews || 0); // Utiliser 0 si aucun avis
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de l'activité:", error);
      }
    };

    fetchActivityDetails();
  }, [auth, activityID]);

  // Fonction pour vérifier si l'activité est déjà dans les favoris de l'utilisateur
  const checkIfFavorite = async (userEmail) => {
    try {
      const docRef = doc(db, "favorites", userEmail);  // Collection favorites
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const favorites = docSnap.data();
        if (favorites[activityTitle]) {
          setIsFavorite(true); // Si le titre de l'activité est dans les favoris, on met à jour l'état
        }
      }
    } catch (error) {
      console.error("Erreur lors de la vérification des favoris:", error);
      Alert.alert("Erreur", "Une erreur s'est produite lors de la vérification des favoris.");
    }
  };

  // Fonction pour ajouter l'activité aux favoris dans Firestore
  const addToFavorites = async (userEmail, activityTitle) => {
    try {
      const docRef = doc(db, "favorites", userEmail);  // Collection favorites
      await setDoc(docRef, {
        [activityTitle]: true // Utilisez le titre de l'activité comme clé et mettez sa valeur à "true" pour indiquer qu'elle est en favori
      }, { merge: true });

      Alert.alert("Favori ajouté", "L'activité a été ajoutée à vos favoris.");
    } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris:", error);
      Alert.alert("Erreur", "Une erreur s'est produite lors de l'ajout aux favoris.");
    }
  };

  // Fonction pour retirer l'activité des favoris dans Firestore
  const removeFromFavorites = async (userEmail, activityTitle) => {
    try {
      const docRef = doc(db, "favorites", userEmail);
      await setDoc(docRef, {
        [activityTitle]: deleteField() // Supprime le titre de l'activité de la collection
      }, { merge: true });

      Alert.alert("Favori retiré", "L'activité a été retirée de vos favoris.");
    } catch (error) {
      console.error("Erreur lors du retrait du favori:", error);
      Alert.alert("Erreur", "Une erreur s'est produite lors du retrait du favori.");
    }
  };

  const handleFavoritePress = () => {
    if (!user) {
      Alert.alert(
        "Connexion requise",
        "Vous devez être connecté pour ajouter des favoris."
      );
      return;
    }

    setIsFavorite(!isFavorite);

    // Si l'activité n'est pas encore un favori, on l'ajoute
    if (!isFavorite) {
      addToFavorites(user.email, activityTitle); // Utiliser le titre de l'activité
    } else {
      // Si l'activité est déjà un favori, on la retire
      removeFromFavorites(user.email, activityTitle); // Utiliser le titre de l'activité
    }
  };

  return (
    <Pressable
      style={{
        ...styles.activity,
        backgroundColor: '#FCAC23', // Couleur jaune pâle de la palette
      }}
      onPress={onPress}
    >
      
      <TouchableOpacity style={styles.Coeur} onPress={handleFavoritePress}>
        <Icon
          name={isFavorite ? "heart" : "heart-o"}
          size={24}
          color={isFavorite ? "#FF0000" : "#000"}
        />
      </TouchableOpacity>

      <View style={styles.activityDetails}>
        <ThemedText type="titleSmall" style={styles.activityTitle}>
          {activityTitle}
        </ThemedText>

        <ThemedText
          numberOfLines={2}
          ellipsizeMode="tail"
          type="titleSmall"
          style={styles.activityDescription}
        >
          {activityDescription}
        </ThemedText>

        {/* Afficher la note et le nombre d'avis */}
        {rating !== null && numberOfReviews > 0 && (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>
              {rating} ★ ({numberOfReviews} avis)
            </Text>
          </View>
        )}
      </View>

      <View style={styles.activityRHS}>
        <ThemedText type="titleSmall" style={styles.activityPrice}>
          €{activityPrice}
        </ThemedText>
        {activePayment === activityID ? (
          <ActivityIndicator />
        ) : (
          <Ionicons
            name="chevron-forward-outline"
            size={18}
            color="#B53302" 
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  activity: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 25,
    paddingLeft: 20,
    paddingRight: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#B53302',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  activityDetails: {
    flex: 1, // Permet de prendre l'espace disponible
    marginRight: 10, // Crée un espacement avec la section de droite
  },
  activityRHS: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B53302',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#E97D01',
    lineHeight: 16,
    maxWidth: '90%', // Limite la largeur pour éviter le chevauchement
  },
  activityPrice: {
    fontSize: 16,
    color: '#FECA64',
    fontWeight: 'bold',
  },
  ratingContainer: {
    marginTop: 5,
  },
  ratingText: {
    fontSize: 14,
    color: '#FECA64',
    fontWeight: 'bold',
  },
  Coeur: {
    right: 10,
    top: 5,
    position: 'absolute',
  },
});
