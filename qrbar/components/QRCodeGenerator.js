import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { FontAwesome } from '@expo/vector-icons'; // Icons for social links

import Logo from '../assets/INSA.png'; // Import company logo

const QRCodeGenerator = () => {
  const qrRef = useRef(); // Ref for capturing QR code
  const [status, requestPermission] = MediaLibrary.usePermissions();

  // Request Media Library permissions on component mount
  React.useEffect(() => {
    if (!status?.granted) {
      requestPermission();
    }
  }, []);

  // Data to encode in QR code
  const socialMediaLinks = JSON.stringify({
    facebook: 'https://facebook.com/organization',
    twitter: 'https://twitter.com/organization',
    youtube: 'https://youtube.com/organization',
    website: 'https://organization.com',
    linkedin: 'https://linkedin.com/company/organization',
    telegram: 'https://t.me/organization',
    instagram: 'https://instagram.com/organization',
  });

  // Capture and save QR Code to gallery
  const handleSaveQRCode = async () => {
    try {
      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 0.8,
      });

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('QR Codes', asset, false);

      Alert.alert('Success', 'QR Code saved to gallery!');
    } catch (error) {
      console.error('Error saving QR code:', error);
      Alert.alert('Error', 'Failed to save QR Code.');
    }
  };

  // Capture and share QR Code
  const handleShareQRCode = async () => {
    try {
      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 0.8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Sharing Unavailable", "Sharing is not available on this device.");
      }
    } catch (error) {
      console.error('Error sharing QR code:', error);
      Alert.alert('Error', 'Failed to share QR Code.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan this QR Code</Text>

      {/* QR Code Container */}
      <View style={styles.qrContainer} ref={qrRef}>
        <QRCode
          value={socialMediaLinks}
          size={250} // Increased QR code size for better readability
          color="black"
          backgroundColor="white"
          logo={Logo} // Center logo in QR code
          logoSize={50} // Adjust size of the logo
          logoBackgroundColor="transparent" // Ensure transparency
        />
      </View>

      {/* Social Media Links */}
      <ScrollView style={styles.linksContainer}>
        <Text style={styles.subTitle}>Follow us:</Text>
        {Object.entries(JSON.parse(socialMediaLinks)).map(([platform, url]) => (
          <View key={platform} style={styles.linkItem}>
            <FontAwesome name="link" size={18} color="gray" />
            <Text style={styles.linkText}>{url}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSaveQRCode}>
          <Text style={styles.buttonText}>💾 Save to Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleShareQRCode}>
          <Text style={styles.buttonText}>📤 Share QR Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#555',
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 5, // Adds shadow on Android
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 20,
  },
  linksContainer: {
    width: '100%',
    maxHeight: 200,
    marginBottom: 20,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  linkText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#007bff',
    flexShrink: 1, // Prevents text from overflowing
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 10,
    elevation: 3, // Android shadow
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QRCodeGenerator;
