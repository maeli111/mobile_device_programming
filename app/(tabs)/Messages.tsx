import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TextInput, Pressable, FlatList, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { collection, addDoc, query, orderBy, onSnapshot, getFirestore, getDocs } from 'firebase/firestore'; 
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebaseConfig'; 
import { useRouter } from 'expo-router'; 
import Header from '../screens/Header'; 
import BottomTabNavigator from '../screens/BottomNavigator'; 

export default function Messages() {
  const [guides, setGuides] = useState<any[]>([]); // Liste des guides
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null); // Guide sélectionné
  const [messages, setMessages] = useState<any[]>([]); // Messages du chat
  const [input, setInput] = useState(''); // Message écrit par l'utilisateur
  const router = useRouter();
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Récupérer la liste des guides depuis Firestore
  const fetchGuides = async () => {
    try {
      const res = await getDocs(collection(db, 'guide')); 
      let guidesList: any[] = [];
      res.forEach((doc) => { 
        guidesList.push({ id: doc.id, name: doc.data().name });
      });
      setGuides(guidesList); 
    } catch (error) {
      console.error('Erreur lors de la récupération des guides :', error);
      Alert.alert('Erreur', 'Impossible de récupérer les guides. Veuillez réessayer plus tard.');
    }
  };

  useEffect(() => {
    fetchGuides(); // Appeler la fonction lors du chargement initial
  }, []);

  useEffect(() => {
    if (selectedGuide) {
      const messagesRef = collection(db, `guide/${selectedGuide}/messages`);
      const q = query(messagesRef, orderBy('createdAt', 'asc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesList);
      });

      return () => unsubscribe();
    }
  }, [selectedGuide]);

  // Envoyer un message
  const sendMessage = async () => {
    if (input.trim() === '') return; // Ne pas envoyer de message vide
    try {
      const messagesRef = collection(db, `guide/${selectedGuide}/messages`);
      await addDoc(messagesRef, {
        text: input,
        createdAt: new Date(),
        sender: 'user',
      });
      setInput('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message :', error);
    }
  };

  const goToChat = (guideName: string) => {
    setSelectedGuide(guideName); // Sélectionner le guide
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header />

      {/* Section des guides */}
      {!selectedGuide ? (
        <View style={styles.guideSelection}>
          <Text style={styles.title}>Choose a guide to chat with:</Text>
          <FlatList
            data={guides}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable style={styles.guideButton} onPress={() => goToChat(item.name)}>
                <Text style={styles.guideButtonText}>{item.name}</Text>
              </Pressable>
            )}
          />
        </View>
      ) : (
        <KeyboardAvoidingView style={styles.chatContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Discussion avec {selectedGuide}</Text>
          </View>

          {/* Liste des messages */}
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[styles.message, item.sender === 'user' ? styles.userMessage : styles.guideMessage]}
              >
                <Text style={styles.messageText}>{item.text}</Text>
              </View>
            )}
            contentContainerStyle={styles.messagesContainer}
          />

          {/* Champ d'entrée pour écrire un message */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Écrire un message..."
              value={input}
              onChangeText={setInput}
            />
            <Pressable style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendButtonText}>Envoyer</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* BottomTabNavigator */}
      <BottomTabNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEDB9B', // Fond principal doux
    justifyContent: 'space-between', // Ce qui permet d'étirer l'espace et de forcer la barre de navigation vers le bas
  },
  guideSelection: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B53302',
    marginBottom: 10,
  },
  guideButton: {
    backgroundColor: '#E97D01',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%', // Augmenter la largeur des boutons (tu peux aussi utiliser une valeur fixe comme 350, si tu préfères)
    alignItems: 'center',
  },
  
  guideButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  headerContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#E97D01',
  },
  messagesContainer: {
    padding: 20,
    flexGrow: 1,
  },
  message: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#B53302',
  },
  guideMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E97D01',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sendButton: {
    backgroundColor: '#B53302',
    padding: 10,
    marginLeft: 10,
    borderRadius: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
