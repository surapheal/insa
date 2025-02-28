import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';

const QRScanner = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const cameraStatus = await BarCodeScanner.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    Alert.alert('QR Code Scanned!', `Data: ${data}`);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      scanQRCodeFromImage(result.assets[0].uri);
    }
  };

  const scanQRCodeFromImage = async (imageUri) => {
    try {
      const fileData = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Simulate QR code scanning (actual QR decoding requires external libraries)
      Alert.alert('Scanning Image...', 'QR code detection from images is limited in Expo Go.');
    } catch (error) {
      console.error('Error reading image file:', error);
      Alert.alert('Error', 'Failed to read image.');
    }
  };

  if (hasCameraPermission === null || hasGalleryPermission === null) {
    return <Text>Requesting permissions...</Text>;
  }

  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera or gallery</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.buttonText}>Tap to Scan Again</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick Image from Gallery</Text>
      </TouchableOpacity>

      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 150,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
  },
  galleryButton: {
    position: 'absolute',
    bottom: 80,
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 300,
    height: 300,
    borderRadius: 8,
    marginTop: 20,
  },
});

export default QRScanner;
