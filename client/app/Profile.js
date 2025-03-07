import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  LayoutAnimation,
  ImageBackground,
  Image,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { logout, fetchUserProfile, uploadProfileImage } from './services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [uploading, setUploading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserProfileData();
    }, [])
  );

  const handleTextInputFocus = (inputName) => {
    console.log(`${inputName} input focused`);
    setIsInputFocused(true);
  };

  const handleTextInputBlur = (inputName) => {
    console.log(`${inputName} input blurred`);
    setIsInputFocused(false);
  };

  const fetchUserProfileData = async () => {
    try {
      const data = await fetchUserProfile();
      console.log('Profile response:', data);
      setUserData(data);
      setEditedName(data.name);
      setEditedEmail(data.email);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
      router.replace('/');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    // Validate inputs
    if (!editedName.trim() || !editedEmail.trim()) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      const response = await axios.put('https://priority-i4dq.onrender.com/api/auth/me', {
        name: editedName.trim(),
        email: editedEmail.trim()
      });

      // Only update the displayed data after successful save
      setUserData(response.data);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    // Reset form values to current user data
    setEditedName(userData.name);
    setEditedEmail(userData.email);
    setIsEditing(false);
    Keyboard.dismiss();
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            await logout();
            router.replace('/');
          },
        },
      ]
    );
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setUploading(true);
        try {
          const response = await uploadProfileImage(result.assets[0].uri);
          setUserData(prev => ({
            ...prev,
            imageUrl: response.imageUrl
          }));
          await fetchUserProfileData();
          Alert.alert('Success', 'Profile picture updated successfully');
        } catch (error) {
          Alert.alert('Error', 'Failed to update profile picture');
        } finally {
          setUploading(false);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const EditProfileModal = () => (
    <Modal
      visible={isEditing}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancelEdit}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Profile</Text>
          
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={editedName}
            onChangeText={setEditedName}
            returnKeyType="next"
            onSubmitEditing={() => {
              this.emailInput?.focus();
            }}
          />

          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            ref={(input) => { this.emailInput = input; }}
            style={styles.input}
            placeholder="Enter your email"
            value={editedEmail}
            onChangeText={setEditedEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="done"
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={handleCancelEdit}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]} 
              onPress={handleUpdateProfile}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ImageBackground 
      source={{ uri: 'https://res.cloudinary.com/dmdmv15pl/image/upload/v1741251194/splash_1_v93eis.png' }} 
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.avatarContainer} 
              onPress={pickImage}
              disabled={uploading}
            >
              {userData?.imageUrl ? (
                <Image
                  source={{ uri: userData.imageUrl }}
                  style={styles.avatar}
                />
              ) : (
                <Ionicons name="person-circle" size={80} color="#cc866f" />
              )}
              {uploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator color="#cc866f" />
                </View>
              )}
              <View style={styles.editIconContainer}>
                <Ionicons name="camera" size={20} color="#e4d4c6" />
              </View>
            </TouchableOpacity>
            <Text style={styles.userName}>{userData?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{userData?.email || 'email@example.com'}</Text>
            <Text style={styles.userRole}>{userData?.role || 'user'}</Text>
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.detailItem}>
              <Ionicons name="call-outline" size={24} color="#cc866f" />
              <Text style={styles.detailText}>
                {userData?.phoneNumber || 'No phone number added'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={24} color="#cc866f" />
              <Text style={styles.detailText}>
                {userData?.address || 'No address added'}
              </Text>
            </View>
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.detailItem}>
              <Ionicons name="nutrition-outline" size={24} color="#cc866f" />
              <Text style={styles.detailText}>
                {userData?.preferences?.dietaryRestrictions?.join(', ') || 'No dietary restrictions'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="restaurant-outline" size={24} color="#cc866f" />
              <Text style={styles.detailText}>
                {userData?.preferences?.favoritesCuisine?.join(', ') || 'No favorite cuisines'}
              </Text>
            </View>
          </View>

          <View style={styles.menuSection}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => router.push({
                pathname: '/editProfile',
                params: { userData: JSON.stringify(userData) }
              })}
            >
              <Ionicons name="person-outline" size={24} color="#cc866f" />
              <Text style={styles.menuText}>Edit Profile</Text>
              <Ionicons name="chevron-forward" size={24} color="#e4d4c6" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#ff3b30" />
              <Text style={[styles.menuText, { color: '#ff3b30' }]}>Logout</Text>
              <Ionicons name="chevron-forward" size={24} color="#e4d4c6" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: 'rgba(37, 34, 40, 1)',

  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(37, 34, 40, 0.8)',
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(37, 34, 40, 0)',
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  editIconContainer: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    backgroundColor: '#cc866f',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#252228',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e4d4c6',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#cc866f',
    marginBottom: 5,
  },
  userRole: {
    fontSize: 14,
    color: '#e4d4c6',
    textTransform: 'capitalize',
  },
  detailsSection: {
    backgroundColor: 'rgba(37, 34, 40, 0)',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#cc866f',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(228, 212, 198, 0.2)',
  },
  detailText: {
    fontSize: 16,
    color: '#e4d4c6',
    marginLeft: 12,
    flex: 1,
  },
  menuSection: {
    backgroundColor: 'rgba(37, 34, 40, 0)',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(228, 212, 198, 0.2)',
  },
  menuText: {
    fontSize: 16,
    color: '#e4d4c6',
    flex: 1,
    marginLeft: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 