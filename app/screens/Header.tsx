import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assure-toi d'avoir installé @expo/vector-icons
import { useRouter } from 'expo-router'; // Utilisation de router pour la navigation
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth

const Header = () => {
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [user, setUser] = useState(null); // État pour suivre l'utilisateur connecté
  const auth = getAuth();

  // Écouteur d'état de l'utilisateur
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Met à jour l'état avec les infos de l'utilisateur
    });

    return () => unsubscribe(); // Nettoyage de l'écouteur
  }, []);

  const closeMenu = () => {
    setIsMenuVisible(false);
  };

  const openMenu = () => {
    setIsMenuVisible(true);
  };

  const navigateToHome = () => {
    router.push('/');
  };

  // Navigation conditionnelle : Login ou Profil
  const navigateToLoginOrProfile = () => {
    if (user) {
      router.push('/Profile'); // Si l'utilisateur est connecté, va vers le profil
    } else {
      router.push('/LoginScreen'); // Sinon, va vers la page de connexion
    }
  };

  // Contenu du menu
  const menuItems = [
    { id: '1', title: 'Home', action: () => router.push('/') },
    { id: '2', title: 'Messages', action: () => router.push('/Messages') },
    { id: '3', title: 'Search', action: () => router.push('/Search') },
    { id: '4', title: 'Map', action: () => router.push('/Map') },
    { id: '5', title: 'My reservations', action: () => router.push('/Reservations') }, 
    { id: '6', title: 'Feedback', action: () => router.push('/Feedback') },
    { id: '7', title: 'My profile', action: () => router.push('/Profile') },
    { id: '8', title: 'About Us', action: () => router.push('/AboutUs') },
    //{ id: '9', title: 'Modify activities', action: () => router.push('/ModifyActivities') },
    // { id: '10', title: 'Booking', action: goToBooking }, // Ajout de Booking
  ];

  return (
    <View style={styles.headerContainer}>
      {/* Icône Menu (à gauche) */}
      <TouchableOpacity style={styles.iconButton} onPress={openMenu}>
        <Ionicons name="menu" size={28} color="#FEDB9B" />
      </TouchableOpacity>

      {/* Titre au centre */}
      <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/')}>
        <Text style={styles.title}>NOMADESCAPE</Text>
      </TouchableOpacity>

      {/* Icône Profil (à droite) */}
      <TouchableOpacity style={styles.iconButton} onPress={navigateToLoginOrProfile}>
        <Ionicons 
          name={user ? "person-circle" : "person-circle-outline"} 
          size={28} 
          color="#FEDB9B" 
        />
      </TouchableOpacity>

      {/* Menu Modal */}
      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeMenu}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            <FlatList
              data={menuItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    item.action();
                    closeMenu();
                  }}
                >
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={closeMenu}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#B53302',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#E97D01',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginTop: 40,
  },

  iconButton: {
    padding: 5,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FECA64',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  menuContainer: {
    backgroundColor: '#FFFFFF',
    width: 250,
    padding: 20,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
  },

  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E97D01',
  },

  menuItemText: {
    fontSize: 18,
    color: '#B53302',
  },

  closeButton: {
    paddingVertical: 15,
    marginTop: 10,
    alignItems: 'center',
  },

  closeButtonText: {
    fontSize: 18,
    color: '#B53302',
    fontWeight: 'bold',
  },
});
