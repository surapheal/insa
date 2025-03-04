import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Animated, TouchableOpacity, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import jsQR from 'jsqr';

const ScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const scanAnimation = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const requestPermissions = async () => {
      const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(galleryStatus === 'granted');
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
      Linking.openURL(data).catch(() => alert('Invalid URL or unable to open the link.'));
    } else {
      alert(`Scanned Data: ${data}`);
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
      alert('Error picking an image.');
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
          alert(`QR Code from Image: ${qrCode.data}`);
        } else {
          alert('No QR code found in the image.');
        }
      };

      reader.readAsArrayBuffer(blob);
    } catch (error) {
      console.error('Error decoding QR code:', error);
      alert('Failed to process QR code.');
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <Text>Requesting permissions...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text>No access to gallery</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.scannerContainer}>
        <RNCamera
          style={StyleSheet.absoluteFillObject}
          onBarCodeRead={scanned ? undefined : handleBarCodeScanned}
          captureAudio={false}
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



// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, Text, Animated, TouchableOpacity, Image } from 'react-native';
// import { BarCodeScanner } from 'expo-barcode-scanner';
// import * as ImagePicker from 'expo-image-picker';
// import * as Linking from 'expo-linking';
// import jsQR from 'jsqr';

// const ScannerScreen = ({ navigation }) => {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [scanned, setScanned] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const scanAnimation = useState(new Animated.Value(0))[0];

//   useEffect(() => {
//     const requestPermissions = async () => {
//       const { status: cameraStatus } = await BarCodeScanner.requestPermissionsAsync();
//       const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       setHasPermission(cameraStatus === 'granted' && galleryStatus === 'granted');
//     };
//     requestPermissions();
//   }, []);

//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(scanAnimation, { toValue: 1, duration: 2000, useNativeDriver: false }),
//         Animated.timing(scanAnimation, { toValue: 0, duration: 2000, useNativeDriver: false }),
//       ])
//     ).start();
//   }, []);

//   const handleBarCodeScanned = ({ data }) => {
//     setScanned(true);
//     if (data.startsWith('http')) {
//       Linking.openURL(data).catch(() => alert('Invalid URL or unable to open the link.'));
//     } else {
//       alert(`Scanned Data: ${data}`);
//     }
//   };

//   const pickImage = async () => {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: false,
//         quality: 1,
//       });

//       if (!result.canceled) {
//         setSelectedImage(result.assets[0].uri);
//         decodeQRCode(result.assets[0].uri);
//       }
//     } catch (error) {
//       alert('Error picking an image.');
//       console.error(error);
//     }
//   };

//   const decodeQRCode = async (imageUri) => {
//     try {
//       const response = await fetch(imageUri);
//       const blob = await response.blob();
//       const reader = new FileReader();

//       reader.onload = () => {
//         const imgData = new Uint8ClampedArray(reader.result);
//         const qrCode = jsQR(imgData, 400, 400);
//         if (qrCode) {
//           alert(`QR Code from Image: ${qrCode.data}`);
//         } else {
//           alert('No QR code found in the image.');
//         }
//       };

//       reader.readAsArrayBuffer(blob);
//     } catch (error) {
//       console.error('Error decoding QR code:', error);
//       alert('Failed to process QR code.');
//     }
//   };

//   if (hasPermission === null) {
//     return (
//       <View style={styles.centered}>
//         <Text>Requesting permissions...</Text>
//       </View>
//     );
//   }

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
//         <BarCodeScanner
//           onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//           style={StyleSheet.absoluteFillObject}
//         />
//         <Animated.View style={[styles.scanLine, {
//           top: scanAnimation.interpolate({ inputRange: [0, 1], outputRange: ['10%', '90%'] })
//         }]} />
//         <Text style={styles.scanText}>Align the QR Code inside the frame</Text>
//       </View>

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
//   },
//   scanText: {
//     position: 'absolute',
//     top: '5%',
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   scanLine: {
//     position: 'absolute',
//     width: '100%',
//     height: 5,
//     backgroundColor: 'red',
//     opacity: 0.8,
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
