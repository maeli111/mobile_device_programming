import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, useColorScheme, Pressable, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../firebaseConfig'; 

export type ActivityProps = PressableProps & {
  activityTitle: string;
  activityPrice: number;
  activityDescription: string;
  activityRating: number;
  activityReviewsCount: number;
  activePayment: string | null;
  activityID: string;
};

export default function Activity({
  activityTitle,
  activityPrice,
  activityDescription,
  activityRating,
  activityReviewsCount,
  onPress,
  activePayment,
  activityID,
  ...rest
}: ActivityProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const auth = getAuth();
  const db = getFirestore(app);

  // Fonction pour vérifier si l'activité est un favori
  const checkIfFavorite = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const userEmail = currentUser.email;
    const docRef = doc(db, 'favorites', userEmail);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const favorites = docSnap.data();
      // Vérifier si le titre de l'activité existe dans les favoris
      if (favorites && favorites[activityTitle]) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    }
  };

  // Vérifier les favoris lorsque l'utilisateur est connecté
  useEffect(() => {
    checkIfFavorite();
  }, []); // Si l'email change, ajouter auth.currentUser au tableau de dépendances

  return (
    <Pressable
      style={{
        ...styles.activity,
        backgroundColor: '#FCAC23',
      }}
      onPress={onPress}
    >
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
      </View>

      <View style={styles.activityRHS}>
        <ThemedText type="titleSmall" style={styles.activityPrice}>
          €{activityPrice}
        </ThemedText>
        {activePayment === activityID ? (
          <ActivityIndicator />
        ) : (
          <>
            <Ionicons
              name="chevron-forward-outline"
              size={18}
              color="#B53302"
            />
          </>
        )}
      </View>

      {/* Afficher l'icône de cœur en haut à droite uniquement si c'est un favori */}
      {isFavorite && (
        <Ionicons
          name="heart"
          size={24}
          color="#FF0000"
          style={styles.favoriteIcon}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  activity: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingLeft: 20,
    paddingRight: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#B53302',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    position: 'relative', 
  },
  activityDetails: {
    flex: 1,
    marginRight: 10,
  },
  ratingDetails: {
    fontSize: 14,
    color: '#FECA64',
    marginTop: 5,
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
    maxWidth: '90%',
  },
  activityPrice: {
    fontSize: 16,
    color: '#FECA64',
    fontWeight: 'bold',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 5, 
    right: 5, 
  },
});
