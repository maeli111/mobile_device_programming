import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../../firebaseConfig'; // Assure-toi que le chemin est correct
import { useNavigation } from '@react-navigation/native';
import Header from '../screens/Header'; // Assurez-vous du bon chemin
import BottomTabNavigator from '../screens/BottomNavigator'; // Assurez-vous du bon chemin

export default function FeedbackScreen() {
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigation = useNavigation();

    const handleSubmit = async () => {
        if (!feedback.trim()) {
            Alert.alert('Error', 'Please enter your feedback before submitting.');
            return;
        }

        setIsSubmitting(true);

        try {
            const db = getFirestore(app);
            await addDoc(collection(db, 'feedbacks'), {
                feedback: feedback,
                createdAt: new Date().toISOString(),
            });
            Alert.alert('Success', 'Thank you for your feedback!');
            setFeedback('');
            navigation.goBack(); // Retour à l'écran précédent
        } catch (error) {
            console.error('Error submitting feedback:', error);
            Alert.alert('Error', 'Failed to submit feedback. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <Header />

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.mainContent}>
                    <Text style={styles.title}>Feedback</Text>
                    <Text style={styles.subtitle}>We value your feedback. Please share your thoughts below:</Text>

                    <TextInput
                        style={styles.textInput}
                        multiline
                        numberOfLines={4}
                        placeholder="Enter your feedback here..."
                        value={feedback}
                        onChangeText={setFeedback}
                    />

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                    >
                        <Text style={styles.submitButtonText}>
                            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* BottomTabNavigator */}
            <BottomTabNavigator />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEDB9B', // Fond beige clair pour l'écran principal
        paddingHorizontal: 20, // Espacement à gauche et droite
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingBottom: 20, // Espace pour éviter que le contenu touche le bas
    },
    mainContent: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 20,
        borderRadius: 8,
        padding: 15,
        shadowColor: '#B53302', // Ombre subtile
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3, // Pour Android
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#B53302', // Rouge foncé pour le titre
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    textInput: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        borderColor: '#ccc',
        borderWidth: 1,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
