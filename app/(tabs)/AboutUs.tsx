import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Header from '../screens/Header'; 
import BottomNavigator from '../screens/BottomNavigator'; 


const AboutUs = () => {
  const [showContactInfo, setShowContactInfo] = useState(false);

  const toggleContactInfo = () => {
    setShowContactInfo(!showContactInfo); 
  };

  const logo = require('../../assets/images/logo.png'); 

  return (
    <View style={styles.container}>
      <Header />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>
      
        <View style={styles.section}>
          <Text style={styles.title}>Welcome to NomadEscape</Text>
          <Text style={styles.text}>
            NomadEscape is a local company based in Malta, specializing in connecting travelers with local guides
            to discover the must-do activities on the island. We offer unique experiences, ranging from hiking to cultural
            tours, while fostering authentic connections between travelers and locals.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Our Services</Text>
          <Text style={styles.text}>
            At NomadEscape, we offer a range of activities across Malta, catering to all interests and ages:
          </Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>- Guided tours of Malta and Gozo</Text>
            <Text style={styles.listItem}>- Hiking and outdoor adventures</Text>
            <Text style={styles.listItem}>- Scuba diving and water activities</Text>
            <Text style={styles.listItem}>- Cultural and historical site explorations</Text>
            <Text style={styles.listItem}>- Tailored activities based on your interests</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Meet Our Team</Text>
          <Text style={styles.text}>
            Our team is made up of passionate and experienced guides, ready to share their knowledge and provide you
            with an unforgettable experience in Malta.
          </Text>
        </View>

        <View style={styles.section2}>
          <Text style={styles.title}>Get In Touch</Text>
          <Text style={styles.text}>
            For more information or to book an activity, feel free to get in touch with us:
          </Text>
          <TouchableOpacity style={styles.contactButton} onPress={toggleContactInfo}>
            <Text style={styles.contactText}>Contact Us</Text>
          </TouchableOpacity>

          {showContactInfo && (
            <View style={styles.contactInfo}>
              <Text style={styles.contactDetails}>Email: support@nomadescape.com</Text>
              <Text style={styles.contactDetails}>Phone: +356 123 456 789</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <BottomNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEDB9B',
    justifyContent: 'space-between',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FEDB9B', 
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#FECA64', 
    borderRadius: 20,
    padding: 20,
    shadowColor: '#B53302',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  logo: {
    width: 120, 
    height: 120,
    resizeMode: 'contain',
  },
  section2: {
    marginBottom: 90,
    backgroundColor: '#FECA64', 
    borderRadius: 20,
    padding: 20,
    shadowColor: '#B53302',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#B53302',
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
  },
  listContainer: {
    marginTop: 10,
    paddingLeft: 20,
  },
  listItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  teamContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  teamMember: {
    alignItems: 'center',
  },
  contactButton: {
    backgroundColor: '#FCAC23',  
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  contactText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  contactInfo: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#FEDB9B', 
    borderColor: '#B53302',
  },
  contactDetails: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default AboutUs;
