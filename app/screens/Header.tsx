import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 

const Header = () => {
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [user, setUser] = useState(null); 
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); 
    });

    return () => unsubscribe(); 
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

  const goToBooking = () => {
    router.push('/Booking');
  };

  const navigateToLoginOrProfile = () => {
    if (user) {
      router.push('/Profile'); 
    } else {
      router.push('/LoginScreen'); 
    }
  };

  const menuItems = [
    { id: '1', title: 'Home', action: () => router.push('/') },
    { id: '2', title: 'Messages', action: () => router.push('/Messages') },
    { id: '3', title: 'Search', action: () => router.push('/Search') },
    { id: '4', title: 'Map', action: () => router.push('/Map') },
    { id: '5', title: 'My reservations', action: () => router.push('/Reservations') }, 
    { id: '6', title: 'Feedback', action: () => router.push('/Feedback') },
    { id: '7', title: 'My profile', action: () => router.push('/Profile') },
    { id: '8', title: 'About Us', action: () => router.push('/AboutUs') },
    { id: '9', title: 'Modify activities', action: () => router.push('/ModifyActivities') },
    { id: '10', title: 'Booking', action: goToBooking }, 
  ];

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.iconButton} onPress={openMenu}>
        <Ionicons name="menu" size={28} color="#FEDB9B" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/')}>
        <Text style={styles.title}>NOMADESCAPE</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButton} onPress={navigateToLoginOrProfile}>
        <Ionicons 
          name={user ? "person-circle" : "person-circle-outline"} 
          size={28} 
          color="#FEDB9B" 
        />
      </TouchableOpacity>

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
    top : 50,
    zIndex : 10,
    marginBottom : 20,
    
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
