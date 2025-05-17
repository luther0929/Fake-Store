import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { colors } from '../styles/colors';

// Get the screen dimensions
const { width, height } = Dimensions.get('window');

export default function ManualSplashScreen({ onFinish }) {
  useEffect(() => {
    // Navigate away after 3 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/splash.png')} 
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    width: width,
    height: height,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  }
});