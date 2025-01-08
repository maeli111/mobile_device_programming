import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Header from '../screens/Header'; // Import Header
import BottomNavigator from '../screens/BottomNavigator'; // Import BottomNavigator

// About Us Component
const AboutUs = () => {
  const [showContactInfo, setShowContactInfo] = useState(false);

  const toggleContactInfo = () => {
    setShowContactInfo(!showContactInfo); // Toggle visibility of contact info
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <Header />

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Company Introduction */}
        <View style={styles.section}>
          <Text style={styles.title}>Welcome to NomadEscape</Text>
          <Text style={styles.text}>
            NomadEscape is a local company based in Malta, specializing in connecting travelers with local guides
            to discover the must-do activities on the island. We offer unique experiences, ranging from hiking to cultural
            tours, while fostering authentic connections between travelers and locals.
          </Text>
        </View>

        {/* Services Offered */}
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

        {/* Meet Our Team */}
        <View style={styles.section}>
          <Text style={styles.title}>Meet Our Team</Text>
          <Text style={styles.text}>
            Our team is made up of passionate and experienced guides, ready to share their knowledge and provide you
            with an unforgettable experience in Malta.
          </Text>

          {/* Team Members */}
          <View style={styles.teamContainer}>
            <View style={styles.teamMember}>
              <Image source={require('../../assets/images/guide1.png')} style={styles.teamImage} />
              <Text style={styles.teamName}>John, Local Guide</Text>
              <Text style={styles.teamRole}>Hiking Expert</Text>
            </View>
            <View style={styles.teamMember}>
              <Image source={require('../../assets/images/guide2.png')} style={styles.teamImage} />
              <Text style={styles.teamName}>Sarah, Cultural Guide</Text>
              <Text style={styles.teamRole}>History & Heritage</Text>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.title}>Get In Touch</Text>
          <Text style={styles.text}>
            For more information or to book an activity, feel free to get in touch with us:
          </Text>
          <TouchableOpacity style={styles.contactButton} onPress={toggleContactInfo}>
            <Text style={styles.contactText}>Contact Us</Text>
          </TouchableOpacity>

          {/* Contact Info (Email & Phone) */}
          {showContactInfo && (
            <View style={styles.contactInfo}>
              <Text style={styles.contactDetails}>📧 Email: support@nomadescape.com</Text>
              <Text style={styles.contactDetails}>📞 Phone: +356 123 456 789</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigator */}
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
    backgroundColor: '#FEDB9B', // Fond principal doux
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#FECA64', // Fond secondaire
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
    color: '#B53302', // Texte titre principal
    textAlign: 'center',
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
  teamImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  teamRole: {
    fontSize: 14,
    color: '#888',
  },
  contactButton: {
    backgroundColor: '#FCAC23',  // Warm orange button
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
