import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../../firebaseConfig";
import { Feather } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import Header from '../screens/Header'; // Assurez-vous que le fichier header.tsx est bien situé dans le bon répertoire
import BottomTabNavigator from '../screens/BottomNavigator'; // Assurez-vous que le fichier bottomNavigator.tsx est bien situé dans le bon répertoire

export default function UserProfileScreen() {
    const router = useRouter(); // To handle navigation
    
    const userInfo = {
        firstName: "John",
        lastName: "Doe",
    };

    // Sign out the user
    function handleSignOut() {
        const auth = getAuth(app);

        signOut(auth)
            .then(() => {
                router.push('/LoginScreen');
            })
            .catch((err) => console.log(err));
    }

    // Navigate to reservation history
    const reservations = () => {
        router.push('/Reservations');
    };

    return (
        <View style={styles.container}>
            {/* Header en dehors du ScrollView */}
            <Header />

            <ScrollView style={styles.scrollContainer}>
                <Text style={styles.header_text}>My Profile</Text>

                <View style={styles.section_container}>

                    <View style={styles.user_card}>
                        <View style={styles.title_container}>
                            <Text style={styles.title}>
                                {userInfo.firstName} {userInfo.lastName}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.card}>
                        <Text style={styles.cardText}>Account Information</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card} onPress={reservations}>
                        <Text style={styles.cardText}>Past Appointments</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.card}>
                        <Text style={styles.cardText}>Feedback</Text>
                    </TouchableOpacity>

                    <View style={styles.logout_container}>
                        <TouchableOpacity
                            style={styles.logout_button}
                            onPress={handleSignOut}
                        >
                            <Text style={styles.logout_text}>Log Out</Text>
                            <Feather
                                style={styles.icon}
                                name="log-out"
                                size={24}
                                color="#FF6347" // Tomato red
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Tab Navigator en dehors du ScrollView */}
            <BottomTabNavigator />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEDB9B', // Couleur de fond
    },
    scrollContainer: {
        flex: 1,
        marginTop: 48,
        paddingBottom: 20,
    },
    user_card: {
        flexDirection: "row",
        borderRadius: 12,
        marginHorizontal: 24,
        marginBottom: 24,
        backgroundColor: "#FECA64", // Couleur jaune clair
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        padding: 16,
        alignItems: 'center',
    },
    section_container: {
        flex: 1,
        marginBottom: 16,
    },
    title_container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 20,
        fontFamily: "Mulish-Medium",
        fontWeight: '600',
        color: "#B53302", // Couleur rouge foncé pour le titre
    },
    header_text: {
        marginHorizontal: 24,
        marginVertical: 24,
        fontSize: 32,
        fontFamily: "Mulish-Medium",
        fontWeight: '700',
        color: "#B53302", // Couleur rouge foncé pour l'en-tête
        textAlign: 'center',
    },
    logout_container: {
        marginTop: 24,
        alignItems: "center",
    },
    logout_button: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    logout_text: {
        padding: 8,
        fontSize: 18,
        fontFamily: "Mulish-SemiBold",
        color: "#E97D01", // Orange pour le texte de déconnexion
    },
    icon: {
        padding: 6,
        marginLeft: 10,
    },
    card: {
        padding: 18,
        backgroundColor: "#FECA64", // Couleur jaune clair pour les cartes
        borderRadius: 10,
        marginHorizontal: 24,
        marginBottom: 15,
        alignItems: "center",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardText: {
        fontSize: 18,
        fontFamily: "Mulish-Regular",
        color: "#FCAC23", // Jaune-orange pour le texte des cartes
    }
});
