// SignInScreen.js - Updated with centered form
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors } from '../styles/colors';
import { commonStyles } from '../styles/common';
import { spacing } from '../styles/spacing';
import CustomButton from '../components/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import { signIn, clearError } from '../redux/authSlice';
import { useNavigation } from '@react-navigation/native';

export default function SignInScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    // Clear any previous errors when the component mounts
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // Navigate back to Main screen when authenticated
    if (isAuthenticated) {
      navigation.navigate('Main');
    }
  }, [isAuthenticated, navigation]);

  useEffect(() => {
    // Show error alert if there's an error
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleClear = () => {
    setEmail('');
    setPassword('');
  };

  const handleSignIn = () => {
    // Validate inputs
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Dispatch sign in action
    dispatch(signIn({ email, password }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign in with your email and password</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        
        <View style={styles.buttonContainer}>
          <CustomButton 
            text="Clear"
            handlePress={handleClear}
            color={colors.primary}
          />
          
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <CustomButton 
              text="Sign In"
              handlePress={handleSignIn}
              color={colors.primary}
            />
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.switchContainer}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.switchText}>
            Don't have an account? Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Centers vertically
    alignItems: 'center',     // Centers horizontally
    backgroundColor: colors.primary,
  },
  formContainer: {
    backgroundColor: colors.secondary,
    borderRadius: spacing.medium,
    padding: spacing.medium,
    width: '90%',
    alignSelf: 'center',
    // Removed marginTop to allow centering
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.fontTitle,
    textAlign: 'center',
    marginBottom: spacing.big,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: spacing.small,
    padding: spacing.small,
    marginBottom: spacing.medium,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.small,
    alignItems: 'center',
  },
  switchContainer: {
    marginTop: spacing.big,
    alignItems: 'center',
  },
  switchText: {
    color: colors.fontTitle,
    fontSize: 14,
  },
});