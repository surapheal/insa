import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';

const QRCodeGeneratorIndiv = () => {
  const qrRef = useRef();
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    name: '',
    idNumber: '',
    dob: '',
    nationality: '',
    publicKey: '',
    photoUri: null, // store only the image URI, not base64
  });
  const [qrData, setQrData] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = (key, value) => {
    setUserData({ ...userData, [key]: value });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5, // lower quality to reduce size
    });

    if (!result.canceled) {
      setUserData({ ...userData, photoUri: result.assets[0].uri });
      setPhotoPreview(result.assets[0].uri);
    }
  };

  const generateQRCode = () => {
    const { name, idNumber, dob, nationality, publicKey, photoUri } = userData;

    if (![name, idNumber, dob, nationality, publicKey, photoUri].every(Boolean)) {
      Alert.alert('Error', 'Please fill in all fields and upload a photo.');
      return;
    }

    // Store only essential data — image URI instead of base64
    const qrPayload = {
      name,
      idNumber,
      dob,
      nationality,
      publicKey,
      photoUri, // smaller data compared to base64
    };

    setQrData(JSON.stringify(qrPayload));
  };

  const saveQRCode = async () => {
    try {
      const uri = await captureRef(qrRef, { format: 'png', quality: 0.8 });
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('QR Codes', asset, false);
      Alert.alert('Success', 'QR Code saved to gallery!');
    } catch (error) {
      console.error('Error saving QR code:', error);
      Alert.alert('Error', 'Failed to save QR Code.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Your QR Code</Text>

      <View style={styles.form}>
        {Object.keys(userData).map((key) => (
          key !== 'photoUri' && (
            <TextInput
              key={key}
              style={styles.input}
              placeholder={`Enter ${key.charAt(0).toUpperCase() + key.slice(1)}`}
              placeholderTextColor="#888"
              value={userData[key]}
              onChangeText={(text) => handleChange(key, text)}
            />
          )
        ))}

        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
          <Text style={styles.buttonText}>Upload Photo</Text>
        </TouchableOpacity>

        {photoPreview && (
          <Image source={{ uri: photoPreview }} style={styles.imagePreview} />
        )}
      </View>

      <TouchableOpacity style={styles.generateButton} onPress={generateQRCode}>
        <Text style={styles.buttonText}>Generate QR Code</Text>
      </TouchableOpacity>

      {qrData && (
        <View style={styles.qrPreview}>
          <Text style={styles.qrTitle}>Your QR Code:</Text>
          <View ref={qrRef} style={styles.qrContainer}>
            <QRCode value={qrData} size={250} />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={saveQRCode}>
            <Text style={styles.buttonText}>Save QR Code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => navigation.navigate('QRScanner')}
          >
            <Text style={styles.buttonText}>Scan QR Code</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#f4f4f4',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  form: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    fontSize: 18,
    color: '#333',
  },
  photoButton: {
    backgroundColor: '#6c63ff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  generateButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 20,
  },
  qrPreview: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  qrTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  scanButton: {
    backgroundColor: '#ff6347',
    padding: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
});

export default QRCodeGeneratorIndiv;
