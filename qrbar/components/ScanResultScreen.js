import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';

const ScanResultScreen = ({ route }) => {
  const { scannedData } = route.params;

  const handleLinkPress = (url) => {
    // Check if the URL is valid before trying to open it
    const isValidUrl = url && url.startsWith('http');
    if (isValidUrl) {
      Linking.openURL(url);
    } else {
      alert('Invalid URL');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Scanned QR Code Data</Text>
      <ScrollView style={styles.content}>
        {Object.keys(scannedData).map((key) => (
          <TouchableOpacity
            key={key}
            style={styles.linkContainer}
            onPress={() => handleLinkPress(scannedData[key])}
          >
            <Text style={styles.linkText}>{key.toUpperCase()}: {scannedData[key]}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  content: {
    marginBottom: 20,
  },
  linkContainer: {
    backgroundColor: '#4CAF50',
    padding: 12,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  linkContainerHovered: {
    backgroundColor: '#45a049', // Darken on hover
  },
});

export default ScanResultScreen;
