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

  // Add timeout for loading state
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    // Clear any previous errors when the component mounts
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // Navigate to main app when authenticated
    if (isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }
  }, [isAuthenticated, navigation]);

  useEffect(() => {
    // Show error alert if there's an error
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  // Reset loading timeout when isLoading changes to false
  useEffect(() => {
    if (!isLoading) {
      setLoadingTimeout(false);
    }
  }, [isLoading]);

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

    // Set a timeout to detect if loading takes too long
    setLoadingTimeout(true);
    const timer = setTimeout(() => {
      if (isLoading) {
        Alert.alert(
          'Connection Issue',
          'The server is taking too long to respond. Please check your network connection or server status.',
          [
            {
              text: 'OK',
              onPress: () => dispatch(clearError())
            }
          ]
        );
      }
    }, 15000); // 15 seconds timeout

    // Dispatch sign in action
    dispatch(signIn({ email, password }))
      .unwrap()
      .catch(error => {
        console.error('Sign in error:', error);
      })
      .finally(() => {
        clearTimeout(timer);
      });
  };

  return (
    <View style={commonStyles.container}>
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
            <View>
              <ActivityIndicator size="large" color={colors.primary} />
              {loadingTimeout && (
                <Text style={styles.timeoutText}>Connecting...</Text>
              )}
            </View>
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
  formContainer: {
    backgroundColor: colors.secondary,
    borderRadius: spacing.medium,
    padding: spacing.medium,
    width: '90%',
    alignSelf: 'center',
    marginTop: spacing.big * 2,
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
  timeoutText: {
    color: colors.fontTitle,
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  }
});