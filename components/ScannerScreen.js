import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Animated, TouchableOpacity, Image, Alert } from 'react-native';
import { Camera } from 'expo-camera'; // Import Expo's Camera
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import jsQR from 'jsqr';

const ScannerScreen = ({ navigation }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants?.Type?.back || Camera.Constants.Type.back); // Safe initialization
  const scanAnimation = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync(); // Request camera permissions
        const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync(); // Request gallery permissions
        setHasCameraPermission(cameraStatus === 'granted' && galleryStatus === 'granted');
      } catch (error) {
        console.error('Permission error:', error);
        setHasCameraPermission(false); // Handle permission error
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnimation, { toValue: 1, duration: 2000, useNativeDriver: false }),
        Animated.timing(scanAnimation, { toValue: 0, duration: 2000, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    if (data.startsWith('http')) {
      Linking.openURL(data).catch(() => Alert.alert('Invalid URL or unable to open the link.'));
    } else {
      Alert.alert('Scanned Data', data);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        decodeQRCode(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error picking an image.');
      console.error(error);
    }
  };

  const decodeQRCode = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onload = () => {
        const imgData = new Uint8ClampedArray(reader.result);
        const qrCode = jsQR(imgData, 400, 400);
        if (qrCode) {
          Alert.alert('QR Code from Image', qrCode.data);
        } else {
          Alert.alert('No QR code found in the image.');
        }
      };

      reader.readAsArrayBuffer(blob);
    } catch (error) {
      console.error('Error decoding QR code:', error);
      Alert.alert('Failed to process QR code.');
    }
  };

  if (hasCameraPermission === null) {
    return (
      <View style={styles.centered}>
        <Text>Requesting permissions...</Text>
      </View>
    );
  }

  if (hasCameraPermission === false) {
    return (
      <View style={styles.centered}>
        <Text>No access to camera or gallery</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.scannerContainer}>
        <Camera
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          type={cameraType} // Using the cameraType state
        />
        <Animated.View
          style={[
            styles.scanLine,
            { top: scanAnimation.interpolate({ inputRange: [0, 1], outputRange: ['10%', '90%'] }) },
          ]}
        />
        <Text style={styles.scanText}>Align the QR Code inside the frame</Text>
      </View>

      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.previewImage} />}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanned(false)}>
          <Text style={styles.scanAgainText}>Scan Again</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
          <Text style={styles.pickImageText}>Scan from Gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerContainer: {
    width: '90%',
    height: '60%',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    position: 'absolute',
    top: '5%',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 5,
    backgroundColor: 'red',
    opacity: 0.8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  scanAgainButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginRight: 10,
  },
  scanAgainText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickImageButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  pickImageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewImage: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScannerScreen;




// import { BarCodeScanner } from 'expo-barcode-scanner';
// import * as ImagePicker from 'expo-image-picker';
// import jsQR from 'jsqr';
// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, Text, Animated, TouchableOpacity, Image, ActivityIndicator, Linking } from 'react-native';

// const ScannerScreen = () => {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [scanned, setScanned] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [isLoading, setIsLoading] = useState(true); // Loading state for permissions
//   const scanAnimation = useState(new Animated.Value(0))[0];

//   // Request permissions for both camera and media library
//   useEffect(() => {
//     const requestPermissions = async () => {
//       try {
//         // Request camera permissions
//         const { status: cameraStatus } = await BarCodeScanner.requestPermissionsAsync();
//         // Request gallery permissions
//         const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         // Set permissions state
//         setHasPermission(cameraStatus === 'granted' && galleryStatus === 'granted');
//       } catch (error) {
//         console.error('Permission error:', error);
//         setHasPermission(false);
//       } finally {
//         setIsLoading(false); // Stop loading after permissions are resolved
//       }
//     };

//     requestPermissions();
//   }, []);

//   // Handle animation for scan line
//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([ 
//         Animated.timing(scanAnimation, { toValue: 1, duration: 2000, useNativeDriver: false }),
//         Animated.timing(scanAnimation, { toValue: 0, duration: 2000, useNativeDriver: false }),
//       ])
//     ).start();
//   }, []);

//   // Handler for barcode scanning
//   const handleBarCodeScanned = ({ data }) => {
//     setScanned(true);
//     if (data.startsWith('http')) {
//       Linking.openURL(data).catch(() => alert('Invalid URL or unable to open the link.'));
//     } else {
//       alert(`Scanned Data: ${data}`);
//     }
//   };

//   // Pick an image from the gallery and decode the QR code from it
//   const pickImage = async () => {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: false,
//         quality: 1,
//       });

//       if (!result.canceled && result.assets.length > 0) {
//         setSelectedImage(result.assets[0].uri);
//         decodeQRCode(result.assets[0].uri); // Process the selected image to decode the QR code
//       }
//     } catch (error) {
//       alert('Error picking an image.');
//       console.error(error);
//     }
//   };

//   // Decode QR code from the selected image
//   const decodeQRCode = async (imageUri) => {
//     try {
//       const response = await fetch(imageUri);  // Fetch image from URI
//       const blob = await response.blob();  // Convert to Blob
//       const reader = new FileReader();  // Use FileReader to read image as array buffer

//       reader.onload = () => {
//         const imgData = new Uint8ClampedArray(reader.result);  // Convert to the required format for jsQR
//         const qrCode = jsQR(imgData, 400, 400);  // Decode QR code from image data
//         if (qrCode) {
//           alert(`QR Code from Image: ${qrCode.data}`);
//         } else {
//           alert('No QR code found in the image.');
//         }
//       };

//       reader.readAsArrayBuffer(blob);  // Convert blob to array buffer
//     } catch (error) {
//       console.error('Error decoding QR code:', error);
//       alert('Failed to process QR code.');
//     }
//   };

//   // Show loading indicator while permissions are being requested
//   if (isLoading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#0000ff" />
//         <Text>Requesting permissions...</Text>
//       </View>
//     );
//   }

//   // Show permission denied message if permissions are not granted
//   if (hasPermission === false) {
//     return (
//       <View style={styles.centered}>
//         <Text>No access to camera or gallery</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.scannerContainer}>
//         {/* BarCodeScanner Component for live scanning */}
//         <BarCodeScanner
//           onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//           style={StyleSheet.absoluteFillObject}
//         />

//         {/* Scan Line (Animated View) */}
//         <Animated.View
//           style={[ 
//             styles.scanLine,
//             {
//               top: scanAnimation.interpolate({
//                 inputRange: [0, 1],
//                 outputRange: ['10%', '90%'],
//               }),
//             },
//           ]}
//         />

//         {/* Scan Text */}
//         <Text style={styles.scanText}>Align the QR Code inside the frame</Text>
//       </View>

//       {/* Display selected image if available */}
//       {selectedImage && (
//         <Image source={{ uri: selectedImage }} style={styles.previewImage} />
//       )}

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanned(false)}>
//           <Text style={styles.scanAgainText}>Scan Again</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
//           <Text style={styles.pickImageText}>Scan from Gallery</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   scannerContainer: {
//     width: '90%',
//     height: '60%',
//     borderRadius: 15,
//     overflow: 'hidden',
//     borderWidth: 2,
//     borderColor: 'white',
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   scanLine: {
//     position: 'absolute',
//     width: '100%',
//     height: 5,
//     backgroundColor: 'red',
//     opacity: 0.8,
//   },
//   scanText: {
//     position: 'absolute',
//     top: '5%',
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   scanAgainButton: {
//     backgroundColor: '#007bff',
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 10,
//     marginRight: 10,
//   },
//   scanAgainText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   pickImageButton: {
//     backgroundColor: '#28a745',
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 10,
//   },
//   pickImageText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   previewImage: {
//     width: 200,
//     height: 200,
//     marginTop: 20,
//     borderRadius: 10,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default ScannerScreen;




