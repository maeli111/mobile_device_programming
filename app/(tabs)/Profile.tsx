import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../../firebaseConfig";
import { getFirestore, collection, query, where, getDoc, getDocs, doc } from "firebase/firestore";
import { Feather } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import Header from '../screens/Header';
import BottomTabNavigator from '../screens/BottomNavigator';
import { ThemedText } from "@/components/ThemedText"; 
import { Svg, Circle, Ellipse, Path } from "react-native-svg";


export default function UserProfileScreen() {
    const router = useRouter();
    const auth = getAuth(app);
    const db = getFirestore(app);

    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        email: "",
        createdAt: "",
    });

    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]); 
    const [showFavorites, setShowFavorites] = useState(false); 
    const [showAccountInfo, setShowAccountInfo] = useState(false);

    function handleSignOut() {
        signOut(auth)
            .then(() => {
                router.push('/LoginScreen');
            })
            .catch((err) => console.log(err));
    }

    const reservations = () => {
        router.push('/Reservations');
    };

    const feedback = () => {
        router.push('/Feedback');
    };

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
                const q = query(
                    collection(db, "users"),
                    where("email", "==", user.email)
                );

                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs[0].data();
                    console.log("User data retrieved: ", userData);

                    setUserInfo({
                        firstName: userData.firstName || "No first name",
                        lastName: userData.lastName || "No last name",
                        email: userData.email || "No email",
                        createdAt: userData.createdAt
                            ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString() 
                            : "No date",
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

    const fetchFavorites = async (userEmail) => {
        try {
            const docRef = doc(db, "favorites", userEmail);  
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const favoritesData = docSnap.data();
                const favoriteActivities = Object.keys(favoritesData).map((activityID) => ({
                    activityID,
                    ...favoritesData[activityID], 
                }));
                setFavorites(favoriteActivities); 
            } else {
                console.log("No favorites found");
                setFavorites([]);
            }
        } catch (error) {
            console.error("Error fetching favorites:", error);
            Alert.alert("Error", "Failed to load favorites.");
        }
    };

    const handleShowFavorites = () => {
        const user = auth.currentUser;
        if (user) {
            setShowFavorites(!showFavorites);
            if (!showFavorites) {
                fetchFavorites(user.email); 
            }
        } else {
            Alert.alert("Error", "You need to be logged in to see your favorites.");
        }
    };

    const handleShowAccountInfo = () => {
        setShowAccountInfo(!showAccountInfo);
    };


    return (
        <View style={styles.container}>
            <Header />

            <ScrollView style={styles.scrollContainer}>
                <Text style={styles.header_text}>My Profile</Text>

                <View style={styles.section_container}>
                    {loading ? (
                        <Text style={styles.cardText}>Loading...</Text>
                    ) : (
                        <>
                            <View style={styles.title_container}>
                                <Text style={styles.title}>
                                    {userInfo.firstName} {userInfo.lastName}
                                </Text>
                            </View>

                            <TouchableOpacity style={styles.card} onPress={handleShowAccountInfo}>

                                <View style={styles.minicard}>

                                    <Svg width="55" height="55" viewBox="0 0 136 136" fill="none">
                                        <Circle cx="68" cy="68" r="68" fill="#B53302" fillOpacity={0.1} />
                                        <Circle cx="68" cy="49" r="12.6667" fill="#B53302" />
                                        <Ellipse cx="68" cy="83.8334" rx="22.1667" ry="12.6667" fill="#B53302" />
                                    </Svg>



                                    <Text style={styles.cardText}>Account Information</Text>


                                </View>

                                <Svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" fill="none">
                                    <Path fill-rule="evenodd" clip-rule="evenodd" d="M16.9393 7.93934C17.5251 7.35355 18.4749 7.35355 19.0607 7.93934L34.0607 22.9393C34.6464 23.5251 34.6464 24.4749 34.0607 25.0607L19.0607 40.0607C18.4749 40.6464 17.5251 40.6464 16.9393 40.0607C16.3536 39.4749 16.3536 38.5251 16.9393 37.9393L30.8787 24L16.9393 10.0607C16.3536 9.47487 16.3536 8.52513 16.9393 7.93934Z" fill="#B53302" />
                                </Svg>
                            </TouchableOpacity>

                            {showAccountInfo && (
                                <View style={styles.accountInfoContainer}>
                                    <Text style={styles.infoText}>First Name: {userInfo.firstName}</Text>
                                    <Text style={styles.infoText}>Last Name: {userInfo.lastName}</Text>
                                    <Text style={styles.infoText}>Email: {userInfo.email}</Text>
                                    <Text style={styles.infoText}>Account Created: {userInfo.createdAt}</Text>
                                </View>
                            )}

                            <TouchableOpacity style={styles.card} onPress={handleShowFavorites}>
                                <View style={styles.minicard}>
                                    <Svg
                                        width="55"
                                        height="55"
                                        viewBox="0 0 136 136"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <Path
                                            d="M136 68C136 105.555 105.555 136 68 136C30.4446 136 0 105.555 0 68C0 30.4446 30.4446 0 68 0C105.555 0 136 30.4446 136 68Z"
                                            fill="#B53302"
                                            fillOpacity={0.1}
                                        />
                                        <Path
                                            d="M36.3333 58.9341C36.3333 74.3334 49.0615 82.5395 58.3788 89.8844C61.6667 92.4763 64.8333 94.9167 68 94.9167C71.1667 94.9167 74.3333 92.4763 77.6212 89.8844C86.9385 82.5395 99.6667 74.3334 99.6667 58.9341C99.6667 43.5349 82.2495 32.614 68 47.4187C53.7505 32.614 36.3333 43.5349 36.3333 58.9341Z"
                                            fill="#B53302"
                                        />
                                    </Svg>

                                    <Text style={styles.cardText}>My Favorites</Text>

                                </View>

                                <Svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" fill="none">
                                    <Path fill-rule="evenodd" clip-rule="evenodd" d="M16.9393 7.93934C17.5251 7.35355 18.4749 7.35355 19.0607 7.93934L34.0607 22.9393C34.6464 23.5251 34.6464 24.4749 34.0607 25.0607L19.0607 40.0607C18.4749 40.6464 17.5251 40.6464 16.9393 40.0607C16.3536 39.4749 16.3536 38.5251 16.9393 37.9393L30.8787 24L16.9393 10.0607C16.3536 9.47487 16.3536 8.52513 16.9393 7.93934Z" fill="#B53302" />
                                </Svg>
                            </TouchableOpacity>

                            {showFavorites && (
                                <View style={styles.favoritesContainer}>
                                    {favorites.length > 0 ? (
                                        favorites.map((favorite) => (
                                            <View key={favorite.activityID} style={styles.favoriteItem}>
                                                <ThemedText style={styles.favoriteText}>{favorite.activityID}</ThemedText>
                                            </View>
                                        ))
                                    ) : (
                                        <Text style={styles.cardText}>No favorites found</Text>
                                    )}
                                </View>
                            )}

                            <TouchableOpacity style={styles.card} onPress={reservations}>
                                <View style={styles.minicard}>
                                    <Svg
                                        width="55"
                                        height="55"
                                        viewBox="0 0 136 136"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <Circle cx="68" cy="68" r="68" fill="#B53302" fillOpacity={0.1} />
                                        <Path
                                            d="M54.5417 37.9167C54.5417 36.605 53.4783 35.5417 52.1667 35.5417C50.855 35.5417 49.7917 36.605 49.7917 37.9167V42.9177C45.2338 43.2826 42.2416 44.1784 40.0433 46.3767C37.845 48.575 36.9493 51.5671 36.5843 56.125H99.4157C99.0507 51.5671 98.155 48.575 95.9567 46.3767C93.7584 44.1784 90.7662 43.2826 86.2083 42.9177V37.9167C86.2083 36.605 85.145 35.5417 83.8333 35.5417C82.5217 35.5417 81.4583 36.605 81.4583 37.9167V42.7075C79.3517 42.6667 76.9903 42.6667 74.3333 42.6667H61.6667C59.0097 42.6667 56.6483 42.6667 54.5417 42.7075V37.9167Z"
                                            fill="#B53302"
                                        />
                                        <Path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M36.3333 68C36.3333 65.3431 36.3333 62.9817 36.3742 60.875H99.6258C99.6667 62.9817 99.6667 65.3431 99.6667 68V74.3334C99.6667 86.2756 99.6667 92.2467 95.9567 95.9567C92.2467 99.6667 86.2756 99.6667 74.3333 99.6667H61.6667C49.7244 99.6667 43.7533 99.6667 40.0433 95.9567C36.3333 92.2467 36.3333 86.2756 36.3333 74.3334V68ZM83.8333 74.3334C85.5822 74.3334 87 72.9156 87 71.1667C87 69.4178 85.5822 68 83.8333 68C82.0844 68 80.6667 69.4178 80.6667 71.1667C80.6667 72.9156 82.0844 74.3334 83.8333 74.3334ZM83.8333 87C85.5822 87 87 85.5823 87 83.8334C87 82.0845 85.5822 80.6667 83.8333 80.6667C82.0844 80.6667 80.6667 82.0845 80.6667 83.8334C80.6667 85.5823 82.0844 87 83.8333 87ZM71.1667 71.1667C71.1667 72.9156 69.7489 74.3334 68 74.3334C66.2511 74.3334 64.8333 72.9156 64.8333 71.1667C64.8333 69.4178 66.2511 68 68 68C69.7489 68 71.1667 69.4178 71.1667 71.1667ZM71.1667 83.8334C71.1667 85.5823 69.7489 87 68 87C66.2511 87 64.8333 85.5823 64.8333 83.8334C64.8333 82.0845 66.2511 80.6667 68 80.6667C69.7489 80.6667 71.1667 82.0845 71.1667 83.8334ZM52.1667 74.3334C53.9156 74.3334 55.3333 72.9156 55.3333 71.1667C55.3333 69.4178 53.9156 68 52.1667 68C50.4178 68 49 69.4178 49 71.1667C49 72.9156 50.4178 74.3334 52.1667 74.3334ZM52.1667 87C53.9156 87 55.3333 85.5823 55.3333 83.8334C55.3333 82.0845 53.9156 80.6667 52.1667 80.6667C50.4178 80.6667 49 82.0845 49 83.8334C49 85.5823 50.4178 87 52.1667 87Z"
                                            fill="#B53302"
                                        />
                                    </Svg>
                                    <Text style={styles.cardText}>Past Appointments</Text>

                                </View>

                                <Svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" fill="none">
                                    <Path fill-rule="evenodd" clip-rule="evenodd" d="M16.9393 7.93934C17.5251 7.35355 18.4749 7.35355 19.0607 7.93934L34.0607 22.9393C34.6464 23.5251 34.6464 24.4749 34.0607 25.0607L19.0607 40.0607C18.4749 40.6464 17.5251 40.6464 16.9393 40.0607C16.3536 39.4749 16.3536 38.5251 16.9393 37.9393L30.8787 24L16.9393 10.0607C16.3536 9.47487 16.3536 8.52513 16.9393 7.93934Z" fill="#B53302" />
                                </Svg>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.card} onPress={feedback}>

                                <View style={styles.minicard}>
                                    <Svg
                                        width="55"
                                        height="55"
                                        viewBox="0 0 136 136"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <Circle cx="68" cy="68" r="68" fill="#B53302" fillOpacity={0.1} />
                                        <Path
                                            d="M45.2 62.9333C45.2 53.3795 45.2 48.6026 48.168 45.6346C51.136 42.6666 55.9129 42.6666 65.4667 42.6666H70.5333C80.0871 42.6666 84.864 42.6666 87.832 45.6346C90.8 48.6026 90.8 53.3795 90.8 62.9333V73.0666C90.8 82.6204 90.8 87.3973 87.832 90.3653C84.864 93.3333 80.0871 93.3333 70.5333 93.3333H65.4667C55.9129 93.3333 51.136 93.3333 48.168 90.3653C45.2 87.3973 45.2 82.6204 45.2 73.0666V62.9333Z"
                                            fill="#B53302"
                                        />
                                        <Path
                                            d="M79.4479 79.4033C79.8912 79.0575 80.2933 78.6555 81.0975 77.8513L91.1229 67.8259C91.3653 67.5835 91.2543 67.166 90.9305 67.0537C89.7471 66.6431 88.2077 65.8723 86.7677 64.4323C85.3278 62.9923 84.5569 61.4529 84.1464 60.2695C84.034 59.9457 83.6166 59.8348 83.3742 60.0772L73.3488 70.1026L73.3487 70.1026C72.5446 70.9068 72.1425 71.3088 71.7967 71.7522C71.3888 72.2752 71.039 72.841 70.7537 73.4398C70.5118 73.9473 70.332 74.4868 69.9723 75.5657L69.5076 76.9598L68.7687 79.1766L68.0759 81.2552C67.8989 81.7861 68.0371 82.3715 68.4328 82.7672C68.8286 83.163 69.4139 83.3012 69.9449 83.1242L72.0234 82.4313L74.2402 81.6924L75.6343 81.2277L75.6343 81.2277C76.7132 80.8681 77.2527 80.6882 77.7603 80.4463C78.359 80.161 78.9249 79.8113 79.4479 79.4033Z"
                                            fill="#F7CA8C"
                                        />
                                        <Path
                                            d="M94.2619 64.6869C96.4016 62.5472 96.4016 59.0779 94.2619 56.9382C92.1221 54.7984 88.6529 54.7984 86.5131 56.9382L86.1908 57.2605C86.0557 57.3956 85.9882 57.4632 85.9303 57.553C85.8392 57.6943 85.7774 57.8914 85.7714 58.0595C85.7677 58.1662 85.784 58.2571 85.8166 58.4388L85.8166 58.4389C85.8655 58.7112 85.9561 59.1094 86.1209 59.5845C86.4506 60.5347 87.0731 61.7819 88.2456 62.9544C89.4181 64.127 90.6654 64.7495 91.6155 65.0791C92.0907 65.244 92.4888 65.3346 92.7612 65.3834C92.9429 65.4161 93.0338 65.4324 93.1406 65.4286C93.3086 65.4227 93.5057 65.3609 93.6471 65.2698C93.7369 65.2119 93.8044 65.1443 93.9395 65.0092L93.9395 65.0092L94.2619 64.6869Z"
                                            fill="#F7CA8C"
                                        />
                                        <Path
                                            d="M79.4479 79.4033C79.8912 79.0575 80.2933 78.6555 81.0975 77.8513L91.1229 67.8259C91.3653 67.5835 91.2543 67.166 90.9305 67.0537C89.7471 66.6431 88.2077 65.8723 86.7677 64.4323C85.3278 62.9923 84.5569 61.4529 84.1464 60.2695C84.034 59.9457 83.6166 59.8348 83.3742 60.0772L73.3488 70.1026L73.3487 70.1026C72.5446 70.9068 72.1425 71.3088 71.7967 71.7522C71.3888 72.2752 71.039 72.841 70.7537 73.4398C70.5118 73.9473 70.332 74.4868 69.9723 75.5657L69.5076 76.9598L68.7687 79.1766L68.0759 81.2552C67.8989 81.7861 68.0371 82.3715 68.4328 82.7672C68.8286 83.163 69.4139 83.3012 69.9449 83.1242L72.0234 82.4313L74.2402 81.6924L75.6343 81.2277L75.6343 81.2277C76.7132 80.8681 77.2527 80.6882 77.7603 80.4463C78.359 80.161 78.9249 79.8113 79.4479 79.4033Z"
                                            stroke="#B53302"
                                            strokeLinecap="round"
                                        />
                                        <Path
                                            d="M94.2619 64.6869C96.4016 62.5472 96.4016 59.0779 94.2619 56.9382C92.1221 54.7984 88.6529 54.7984 86.5131 56.9382L86.1908 57.2605C86.0557 57.3956 85.9882 57.4632 85.9303 57.553C85.8392 57.6943 85.7774 57.8914 85.7714 58.0595C85.7677 58.1662 85.784 58.2571 85.8166 58.4388L85.8166 58.4389C85.8655 58.7112 85.9561 59.1094 86.1209 59.5845C86.4506 60.5347 87.0731 61.7819 88.2456 62.9544C89.4181 64.127 90.6654 64.7495 91.6155 65.0791C92.0907 65.244 92.4888 65.3346 92.7612 65.3834C92.9429 65.4161 93.0338 65.4324 93.1406 65.4286C93.3086 65.4227 93.5057 65.3609 93.6471 65.2698C93.7369 65.2119 93.8044 65.1443 93.9395 65.0092L93.9395 65.0092L94.2619 64.6869Z"
                                            stroke="#B53302"
                                            strokeLinecap="round"
                                        />
                                        <Path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M55.9667 60.4C55.9667 59.3507 56.8173 58.5 57.8667 58.5H74.3333C75.3827 58.5 76.2333 59.3507 76.2333 60.4C76.2333 61.4493 75.3827 62.3 74.3333 62.3H57.8667C56.8173 62.3 55.9667 61.4493 55.9667 60.4ZM55.9667 70.5333C55.9667 69.484 56.8173 68.6333 57.8667 68.6333H65.4667C66.516 68.6333 67.3667 69.484 67.3667 70.5333C67.3667 71.5827 66.516 72.4333 65.4667 72.4333H57.8667C56.8173 72.4333 55.9667 71.5827 55.9667 70.5333ZM55.9667 80.6667C55.9667 79.6173 56.8173 78.7667 57.8667 78.7667H61.6667C62.716 78.7667 63.5667 79.6173 63.5667 80.6667C63.5667 81.716 62.716 82.5667 61.6667 82.5667H57.8667C56.8173 82.5667 55.9667 81.716 55.9667 80.6667Z"
                                            fill="#F7CA8C"
                                        />
                                    </Svg>

                                    <Text style={styles.cardText}>Feedback</Text>

                                </View>

                                <Svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" fill="none">
                                    <Path fill-rule="evenodd" clip-rule="evenodd" d="M16.9393 7.93934C17.5251 7.35355 18.4749 7.35355 19.0607 7.93934L34.0607 22.9393C34.6464 23.5251 34.6464 24.4749 34.0607 25.0607L19.0607 40.0607C18.4749 40.6464 17.5251 40.6464 16.9393 40.0607C16.3536 39.4749 16.3536 38.5251 16.9393 37.9393L30.8787 24L16.9393 10.0607C16.3536 9.47487 16.3536 8.52513 16.9393 7.93934Z" fill="#B53302" />
                                </Svg>
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

    title: {
        top: 0,
        left: 35,
        marginBottom: 30,
        fontSize: 24,
        fontWeight: '700',
        color: "#E97D01",
        fontFamily: "Raleways",
    },
    header_text: {
        marginHorizontal: 24,
        marginBottom: 30,
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
    minicard: {
        display: "flex",
        alignItems: "center",
        gap: 18,
        flexDirection: 'row',
    },

    card: {
        justifyContent: "space-between",
        padding: 10,
        flexDirection: 'row',
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
        fontWeight: "bold",
    },
    favoritesContainer: {
        marginTop: 20,
        paddingHorizontal: 24,
    },
    favoriteItem: {
        padding: 10,
        backgroundColor: "#FECA64",
        marginBottom: 10,
        borderRadius: 8,
    },
    favoriteText: {
        fontSize: 16,
        color: "#B53302",
    },
    accountInfoContainer: {
        marginBottom: 25,
        marginHorizontal: 24,
        padding: 16,
        backgroundColor: "#FECA64",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    infoText: {
        fontSize: 16,
        color: "#B53302",
        marginBottom: 0,
    },
});
