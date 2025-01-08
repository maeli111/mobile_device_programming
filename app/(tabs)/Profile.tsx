import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../../firebaseConfig";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { Feather } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import Header from '../screens/Header';
import BottomTabNavigator from '../screens/BottomNavigator';

export default function UserProfileScreen() {
    const router = useRouter();
    const auth = getAuth(app);
    const db = getFirestore(app);

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

    const feedback = () => {
        router.push('/Feedback');
    };

    // Vérifier si l'utilisateur est connecté et récupérer les informations
    useEffect(() => {
        const user = auth.currentUser;

        if (!user) {
            Alert.alert(
                "Error",
                "You must be logged in to access this page.",
                [
                    { 
                        text: "OK", 
                        onPress: () => router.push('/LoginScreen') 
                    }
                ]
            );
            return;
        }

        const fetchUserInfo = async () => {
            try {
                // Récupérer les informations basées sur l'email
                const q = query(
                    collection(db, "informations"),
                    where("email", "==", user.email)
                );

                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs[0].data();
                    console.log("User data retrieved: ", userData);

                    setUserInfo({
                        firstName: userData.firstName || "No first name",
                        lastName: userData.lastName || "No last name",
                    });
                } else {
                    console.log("No documents found!");
                    Alert.alert("Error", "User information not found in Firestore.");
                }

            } catch (error) {
                console.error("Error retrieving document:", error);
                Alert.alert("Error", "Failed to load user information");
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

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

                            <TouchableOpacity style={styles.card} onPress={feedback}>
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
                                        color="#FF6347"
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
        backgroundColor: '#FEDB9B',
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
        backgroundColor: "#FECA64",
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
        fontWeight: '600',
        color: "#B53302",
    },
    header_text: {
        marginHorizontal: 24,
        marginVertical: 24,
        fontSize: 32,
        fontWeight: '700',
        color: "#B53302",
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
        color: "#E97D01",
    },
    icon: {
        padding: 6,
        marginLeft: 10,
    },
    card: {
        padding: 18,
        backgroundColor: "#FECA64",
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
        color: "#FCAC23",
    }
});
