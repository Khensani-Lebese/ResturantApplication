import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Material Icons

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !name) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'https://restaurant-server-5htc.onrender.com/api/auth/register',
        {
          email,
          password,
          name,
        }
      );

      console.log('Registration successful:', response.data);

      // Navigate back to login
      router.replace('/');
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (placeholder, value, onChangeText, iconName, secure = false) => (
    <View style={styles.inputContainer}>
      <Icon name={iconName} size={24} color="gray" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure}
        autoCapitalize={placeholder === 'Email' ? 'none' : 'words'}
        keyboardType={placeholder === 'Email' ? 'email-address' : 'default'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <Image source={require('../Icon.png')} style={styles.logo} />

      {/* Title */}
      <Text style={styles.title}>Create Account</Text>

      {/* Input Fields */}
      {renderInputField('Full Name', name, setName, 'person')}
      {renderInputField('Email', email, setEmail, 'email')}
      {renderInputField('Password', password, setPassword, 'lock', true)}
      {renderInputField('Confirm Password', confirmPassword, setConfirmPassword, 'lock', true)}

      {/* Error Message */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Loading Indicator or Buttons */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
          <View style={styles.loginLink}>
            <Text>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/')}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#e0a314',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 50,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#ff5733',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 130,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLink: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});
