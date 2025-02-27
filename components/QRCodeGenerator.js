import React, { useRef, useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as BarcodeScanner from 'expo-barcode-scanner'; // Import barcode scanner
import Logo from '../assets/INSA.png'; // Import your company logo

const QRCodeGenerator = () => {
  const qrRef = useRef(); // Ref for capturing QR code
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [scannedQRCode, setScannedQRCode] = useState(null); // Store scanned QR code data
  const [imageUri, setImageUri] = useState(null); // Store selected image URI

  // Request Media Library permissions only when needed
  useEffect(() => {
    if (status && !status.granted) {
      requestPermission();
    }

    // Request camera permissions
    const getCameraPermission = async () => {
      const { status } = await BarcodeScanner.requestPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    };
    getCameraPermission();
  }, [status]);

  const webPageUrl = 'https://surapheal.github.io/nidp/nidp.html'; // URL for the QR Code

  // Capture and save QR Code to gallery
  const handleSaveQRCode = useCallback(async () => {
    try {
      const uri = await captureRef(qrRef, { format: 'png', quality: 0.8 });
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('QR Codes', asset, false);
      Alert.alert('Success', 'QR Code saved to gallery!');
    } catch (error) {
      console.error('Error saving QR code:', error);
      Alert.alert('Error', 'Failed to save QR Code.');
    }
  }, []);

  // Capture and share QR Code
  const handleShareQRCode = useCallback(async () => {
    try {
      const uri = await captureRef(qrRef, { format: 'png', quality: 0.8 });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Sharing Unavailable', 'Sharing is not available on this device.');
      }
    } catch (error) {
      console.error('Error sharing QR code:', error);
      Alert.alert('Error', 'Failed to share QR Code.');
    }
  }, []);

  // Open the image picker to choose an image from the gallery
  const openGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri); // Set the image URI from the gallery
      handleScanQRCode(result.uri); // Start scanning the QR code from the selected image
    }
  };

  // Scan QR code from image
  const handleScanQRCode = async (uri) => {
    const result = await BarcodeScanner.scanFromURLAsync(uri);
    if (result && result.length > 0) {
      setScannedQRCode(result[0].data); // Set scanned QR code data
      Alert.alert('QR Code Scanned', `QR Code Data: ${result[0].data}`);
    } else {
      Alert.alert('No QR Code Found', 'Could not find a QR code in the selected image.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generate and Scan QR Code</Text>

      {/* QR Code Wrapper */}
      <View style={styles.qrWrapper}>
        <View style={styles.qrContainer} ref={qrRef}>
          <QRCode
            value={webPageUrl}
            size={260}
            color="black"
            backgroundColor="white"
            logo={Logo}
            logoSize={50}
            logoBackgroundColor="transparent"
          />
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSaveQRCode}>
          <Text style={styles.buttonText}>💾 Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.shareButton]} onPress={handleShareQRCode}>
          <Text style={styles.buttonText}>📤 Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.scanButton]} onPress={openGallery}>
          <Text style={styles.buttonText}>📸 Scan from Gallery</Text>
        </TouchableOpacity>
      </View>

      {/* Display QR Code from gallery if available */}
      {imageUri && (
        <View style={styles.imagePreviewContainer}>
          <Text style={styles.previewText}>Selected Image:</Text>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        </View>
      )}

      {/* Display scanned QR code data */}
      {scannedQRCode && (
        <View style={styles.scannedDataContainer}>
          <Text style={styles.scannedDataText}>Scanned QR Code Data:</Text>
          <Text style={styles.scannedDataText}>{scannedQRCode}</Text>
        </View>
      )}
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  qrWrapper: {
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 50,
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 10,
    elevation: 3,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  shareButton: {
    backgroundColor: '#007bff',
  },
  scanButton: {
    backgroundColor: '#ffc107',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  previewText: {
    fontSize: 16,
    marginBottom: 10,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  scannedDataContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  scannedDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default QRCodeGenerator;
