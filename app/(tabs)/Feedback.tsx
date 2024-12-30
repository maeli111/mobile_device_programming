import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../../firebaseConfig'; // Assure-toi que le chemin est correct
import { useNavigation } from '@react-navigation/native';

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
        <View style={styles.container}>
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
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
