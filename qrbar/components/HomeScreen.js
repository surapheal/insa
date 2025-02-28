import React from 'react';
import { View, StyleSheet, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button
        title="Scan QR Code"
        onPress={() => navigation.navigate('Scanner')}
      />
      <Button
        title="Generate QR Code"
        onPress={() => navigation.navigate('QRCodeGenerator')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;