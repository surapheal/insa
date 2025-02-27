import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to QR Manager</Text>

      <View style={styles.buttonContainer}>
        {/* Scan QR Code Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Scanner')}
        >
          <Ionicons name="scan-outline" size={28} color="white" />
          <Text style={styles.buttonText}>Scan QR Code</Text>
        </TouchableOpacity>

        {/* Generate QR Code Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('QRCodeGenerator')}
        >
          <Ionicons name="qr-code-outline" size={28} color="white" />
          <Text style={styles.buttonText}>Generate QR Code</Text>
        </TouchableOpacity>

        {/* Individual QR Code Generation */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('QRCodeGeneratorIndiv')}
        >
          <Ionicons name="person-outline" size={24} color="#007bff" />
          <Text style={styles.secondaryButtonText}>Individual QR Generator</Text>
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
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 12,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    borderColor: '#007bff',
    borderWidth: 2,
  },
  secondaryButtonText: {
    color: '#007bff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default HomeScreen;
