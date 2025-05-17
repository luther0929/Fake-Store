import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import { colors } from '../styles/colors';
import { commonStyles } from '../styles/common';
import { spacing } from '../styles/spacing';
import CustomButton from '../components/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, signOutAndClearData, clearError } from '../redux/authSlice';
import { useNavigation } from '@react-navigation/native';

export default function UserProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user, token, isLoading, error } = useSelector(state => state.auth);

  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    // Clear any previous errors when the component mounts
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // Show error alert if there's an error
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleUpdate = () => {
    // Check if passwords match for confirmation
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Create update data object
    const updateData = {
      name: newName,
    };

    // Only include password if it's provided
    if (newPassword) {
      updateData.password = newPassword;
    }

    // Dispatch update profile action
    dispatch(updateProfile({ 
      userId: user.id, 
      token, 
      userData: {
        ...updateData,
        email: user.email // Include email for our local state
      }
    }));

    // Close modal after update
    setModalVisible(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSignOut = () => {
    // Use the signOutAndClearData thunk to clear cart data as well
    dispatch(signOutAndClearData())
      .unwrap()
      .catch(error => {
        console.error('Sign out error:', error);
      });
    
    // No navigation reset - the app will automatically respond to the auth state change
  };

  if (!user) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <View style={styles.profileContainer}>
        <Text style={styles.title}>User Profile</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.info}>{user.name}</Text>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.info}>{user.email}</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <CustomButton 
            text="Update"
            handlePress={() => setModalVisible(true)}
            color={colors.primary}
          />
          
          <CustomButton 
            text="Sign Out"
            handlePress={handleSignOut}
            color={colors.primary}
          />
        </View>
      </View>

      {/* Update Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Update Profile</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newName}
              onChangeText={setNewName}
            />
            
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            
            <View style={styles.modalButtons}>
              <CustomButton 
                text="Cancel"
                handlePress={() => {
                  setModalVisible(false);
                  setNewName(user.name);
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                color={colors.primary}
              />
              
              {isLoading ? (
                <ActivityIndicator size="large" color={colors.primary} />
              ) : (
                <CustomButton 
                  text="Confirm"
                  handlePress={handleUpdate}
                  color={colors.primary}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: colors.secondary,
    borderRadius: spacing.medium,
    padding: spacing.medium,
    width: '90%',
    alignSelf: 'center',
    marginTop: spacing.big * 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.fontTitle,
    textAlign: 'center',
    marginBottom: spacing.big,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: spacing.medium,
    paddingHorizontal: spacing.medium,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.fontTitle,
    width: '30%',
  },
  info: {
    fontSize: 16,
    color: colors.fontTitle,
    width: '70%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.big,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: colors.secondary,
    borderRadius: spacing.medium,
    padding: spacing.big,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.fontTitle,
    marginBottom: spacing.medium,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: spacing.small,
    padding: spacing.small,
    width: '100%',
    marginBottom: spacing.medium,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: spacing.small,
    alignItems: 'center',
  },
});