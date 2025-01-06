import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../../firebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import Firestore
import { Feather } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import Header from '../screens/Header'; 
import BottomTabNavigator from '../screens/BottomNavigator'; 

export default function UserProfileScreen() {
    const router = useRouter();
    const auth = getAuth(app);
    const db = getFirestore(app); // Firestore instance

    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
    });

    const [loading, setLoading] = useState(true);

    // Fonction de déconnexion
    function handleSignOut() {
        signOut(auth)
            .then(() => {
                router.push('/LoginScreen');
            })
            .catch((err) => console.log(err));
    }

    // Naviguer vers l'historique des réservations
    const reservations = () => {
        router.push('/Reservations');
    };

    // Fetch des données utilisateur depuis Firestore
    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            // Récupérer les données depuis Firestore en utilisant l'UID de l'utilisateur
            const userDocRef = doc(db, "users", user.uid); // Assure-toi que la collection s'appelle 'users'
            getDoc(userDocRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        // Affiche tout le document pour voir sa structure
                        const userData = docSnap.data();
                        console.log("Données utilisateur récupérées: ", userData); // Vérifie ce qui est récupéré

                        setUserInfo({
                            firstName: userData.firstName || "Pas de prénom", // Valeur par défaut si introuvable
                            lastName: userData.lastName || "Pas de nom", // Valeur par défaut si introuvable
                        });
                    } else {
                        console.log("Aucun document trouvé !");
                        Alert.alert("Erreur", "Données utilisateur introuvables dans Firestore.");
                    }
                    setLoading(false); // Fin du chargement
                })
                .catch((error) => {
                    console.log("Erreur lors de la récupération du document:", error);
                    Alert.alert("Erreur", "Échec du chargement des informations utilisateur");
                    setLoading(false); // Fin du chargement en cas d'erreur
                });
        } else {
            console.log("Aucun utilisateur connecté");
        }
    }, []); // La dépendance vide [] permet de lancer useEffect une seule fois au montage du composant

    return (
        <View style={styles.container}>
            {/* Header en dehors du ScrollView */}
            <Header />

            <ScrollView style={styles.scrollContainer}>
                <Text style={styles.header_text}>My Profile</Text>

                <View style={styles.section_container}>
                    {loading ? (
                        <Text style={styles.cardText}>Loading...</Text>
                    ) : (
                        <>
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
                        </>
                    )}
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
