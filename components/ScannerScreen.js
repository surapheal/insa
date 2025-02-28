import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Animated, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Linking from 'expo-linking';

const ScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const scanAnimation = useState(new Animated.Value(0))[0]; // Animation State

  useEffect(() => {
    const requestCameraPermission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    requestCameraPermission();
  }, []);

  // Start scan animation
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

  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.scannerContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {/* Scanning Animation */}
        <Animated.View style={[styles.scanLine, { top: scanAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['10%', '90%'],
        })}]} />
        <Text style={styles.scanText}>Align the QR Code inside the frame</Text>
      </View>

      {scanned && (
        <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanned(false)}>
          <Text style={styles.scanAgainText}>Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Styles
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
  scanAgainButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  scanAgainText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScannerScreen;
