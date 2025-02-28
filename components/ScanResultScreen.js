import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  Alert,
  Clipboard,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Icons
import Logo from '../assets/INSA.png'; // Import company logo

const ScanResultScreen = ({ route }) => {
  const { scannedData } = route.params;

  // Function to handle link press
  const handleLinkPress = (url) => {
    if (url && url.startsWith('http')) {
      Linking.openURL(url);
    } else {
      Alert.alert('Invalid URL', 'This is not a valid link.');
    }
  };

  // Copy to Clipboard
  const handleCopyToClipboard = (text) => {
    Clipboard.setString(text);
    Alert.alert('Copied', 'Link copied to clipboard.');
  };

  // Get platform-specific icon
  const getPlatformIcon = (platform) => {
    const icons = {
      facebook: 'facebook',
      twitter: 'twitter',
      youtube: 'youtube',
      website: 'globe',
      linkedin: 'linkedin',
      telegram: 'telegram',
      instagram: 'instagram',
    };
    return icons[platform.toLowerCase()] || 'link';
  };

  return (
    <View style={styles.container}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <Image source={Logo} style={styles.logo} />
        <Text style={styles.headerText}>Scanned QR Code Links</Text>
      </View>

      {/* List of Links */}
      <ScrollView style={styles.linksContainer}>
        {Object.keys(scannedData).map((key) => (
          <TouchableOpacity
            key={key}
            style={styles.linkCard}
            onPress={() => handleLinkPress(scannedData[key])}
            onLongPress={() => handleCopyToClipboard(scannedData[key])} // Copy link on long press
          >
            <View style={styles.linkContent}>
              <FontAwesome name={getPlatformIcon(key)} size={24} color="#007bff" />
              <View style={styles.linkTextContainer}>
                <Text style={styles.linkTitle}>{key.toUpperCase()}</Text>
                <Text style={styles.linkUrl} numberOfLines={1}>
                  {scannedData[key]}
                </Text>
              </View>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  linksContainer: {
    flex: 1,
  },
  linkCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  linkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  linkTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  linkUrl: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default ScanResultScreen;
