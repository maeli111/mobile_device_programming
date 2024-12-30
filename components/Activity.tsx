import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, useColorScheme, Pressable, ViewProps, PressableProps, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import React from 'react';

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

  return (
    <Pressable
      style={{
        ...styles.activity,
        backgroundColor: '#FCAC23', // Couleur jaune pâle de la palette
      }}
      onPress={onPress}
    >
      <View>
        <ThemedText type="titleSmall" style={styles.activityTitle}>
          {activityTitle}
        </ThemedText>

        <ThemedText type="titleSmall" style={styles.activityDescription}>
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

    paddingVertical: 15,
    paddingLeft: 20,
    paddingRight: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#B53302', // Ombre rouge foncé pour donner un effet 3D
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3, // Pour l'effet ombre sur Android
  },
  activityRHS: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 7,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B53302', // Rouge foncé pour le titre de l'activité
  },
  activityDescription: {
    fontSize: 14,
    color: '#E97D01', // Orange foncé pour la description de l'activité
  },
  activityPrice: {
    fontSize: 16,
    color: '#FECA64', // Jaune doré pour le prix de l'activité
  },
});
