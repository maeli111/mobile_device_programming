import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assure-toi d'avoir installé @expo/vector-icons
import { useRouter } from 'expo-router';  // Utilisation de router pour la navigation

const Header = () => {
  const router = useRouter(); // Gestion de la navigation
  const [isMenuVisible, setIsMenuVisible] = useState(false); // Gestion de l'affichage du menu

  // Fonction pour fermer le menu
  const closeMenu = () => {
    setIsMenuVisible(false); blablabla
  };

  // Fonction pour ouvrir le menu
  const openMenu = () => {
    setIsMenuVisible(true);
  };

  // Fonction pour naviguer vers Home
  const navigateToHome = () => {
    router.push('/');
  };

  // Fonction pour naviguer vers LoginScreen
  const navigateToLogin = () => {
    router.push('/LoginScreen');
  };

  // Contenu du menu
  const menuItems = [
    { id: '1', title: 'Home', action: navigateToHome },
    { id: '2', title: 'Messages', action: () => router.push('/Messages') },
    { id: '3', title: 'Search', action: () => router.push('/Search') },
    { id: '4', title: 'Map', action: () => router.push('/Map') },
    { id: '5', title: 'My reservations', action: () => router.push('/Reservations') },
    { id: '6', title: 'Feedback', action: () => router.push('/Feedback') },
    { id: '7', title: 'My profile', action: () => router.push('/Profile') },
    { id: '8', title: 'About Us', action: () => router.push('/AboutUs') },
    { id: '9', title: 'Modify activities', action: () => router.push('/ModifyActivities') },
  ];

  return (
    <View style={styles.headerContainer}>
      {/* Icône Menu (à gauche) */}
      <TouchableOpacity style={styles.iconButton} onPress={openMenu}>
        <Ionicons name="menu" size={28} color="#FEDB9B" />
      </TouchableOpacity>

      {/* Titre au centre */}
      <TouchableOpacity style={styles.iconButton} onPress={navigateToHome}>
        <Text style={styles.title}>NOMADESCAPE</Text>
      </TouchableOpacity>

      {/* Icône Profil (à droite) */}
      <TouchableOpacity style={styles.iconButton} onPress={navigateToLogin}>
        <Ionicons name="person-circle-outline" size={28} color="#FEDB9B" />
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
                <TouchableOpacity style={styles.menuItem} onPress={() => { item.action(); closeMenu(); }}>
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
    backgroundColor: '#B53302', // Fond rouge intense
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#E97D01', // Bordure orange vif
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginTop: 20,
  },

  iconButton: {
    padding: 5,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FECA64', // Texte jaune doré
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Ombre de fond pour le menu
  },

  menuContainer: {
    backgroundColor: '#FFFFFF',
    width: 250,
    padding: 20,
    borderRadius: 10,
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
