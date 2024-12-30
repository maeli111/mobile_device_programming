import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, useColorScheme, Pressable, ViewProps, PressableProps, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { Colors } from '@/constants/Colors';

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
        backgroundColor: theme === 'dark' ? 'grey' : '#f9f9f9',
      }}
      onPress={onPress}
    >
      <View>
        <ThemedText type="titleSmall">{activityTitle}</ThemedText>
        <ThemedText type="small">{activityDescription}</ThemedText>
      </View>

      <View style={styles.activityRHS}>
        <ThemedText type="titleSmall">€{activityPrice}</ThemedText>
        {activePayment === activityID && <ActivityIndicator />}
        {activePayment !== activityID && (
          <Ionicons
            name="chevron-forward-outline"
            size={18}
            color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
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
  },
  activityRHS: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 7,
  },
});
