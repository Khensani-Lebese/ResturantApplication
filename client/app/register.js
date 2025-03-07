import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Keyboard, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import CustomInput from './components/CustomInput';
import { validateEmail, validatePassword, validateName, validateConfirmPassword } from './utils/validation';
import { register } from './services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from './components/CustomAlert';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Add error states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'success'
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleRegister = async () => {
    // Reset all errors
    setError('');
    
    // Validate all inputs
    const nameValidationError = validateName(name);
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);
    const confirmPasswordValidationError = validateConfirmPassword(password, confirmPassword);
    
    setNameError(nameValidationError);
    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);
    setConfirmPasswordError(confirmPasswordValidationError);

    if (nameValidationError || emailValidationError || 
        passwordValidationError || confirmPasswordValidationError) {
      return;
    }

    setLoading(true);
    try {
      const userData = {
        name,
        email,
        password,
      };

      await register(userData);
      
      // Show success alert
      setAlertConfig({
        title: 'Success!',
        message: 'Registration successful! Please login to continue.',
        type: 'success'
      });
      setAlertVisible(true);
      
    } catch (err) {
      const errorMessage = err.error || 'Registration failed. Please try again.';
      setError(errorMessage);
      setAlertConfig({
        title: 'Registration Error',
        message: errorMessage,
        type: 'error'
      });
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
    colors={[ '#e5d2bc', '#a5816a']}
    style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {!isKeyboardVisible && (
              <View style={styles.absoluteLogoContainer}>
                <Image 
                  source={require('../assets/logo.png')}
                  style={[styles.logo]}
                  resizeMode="contain"
                />
              </View>
            )}
            
            <View style={[
              styles.contentContainer,
              isKeyboardVisible && styles.contentContainerKeyboardOpen
            ]}>
              <Text style={styles.welcomeText}>Create Account</Text>
              <Text style={styles.subtitleText}>Sign up to get started</Text>
              
              <View style={styles.formContainer}>
                <CustomInput
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (nameError) setNameError(validateName(text));
                  }}
                  placeholder="Full Name"
                  icon="person-outline"
                  error={nameError}
                  autoCapitalize="words"
                />

                <CustomInput
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError(validateEmail(text));
                  }}
                  placeholder="Email"
                  icon="mail-outline"
                  error={emailError}
                  keyboardType="email-address"
                />

                <CustomInput
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError(validatePassword(text));
                  }}
                  placeholder="Password"
                  icon="lock-closed-outline"
                  error={passwordError}
                  secureTextEntry={!showPassword}
                  showPassword={showPassword}
                  togglePassword={() => setShowPassword(!showPassword)}
                />

                <CustomInput
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (confirmPasswordError) 
                      setConfirmPasswordError(validateConfirmPassword(password, text));
                  }}
                  placeholder="Confirm Password"
                  icon="lock-closed-outline"
                  error={confirmPasswordError}
                  secureTextEntry={!showConfirmPassword}
                  showPassword={showConfirmPassword}
                  togglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                />

                <Text style={styles.error}>{error}</Text>

                {loading ? (
                  <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
                ) : (
                  <>
                    <TouchableOpacity 
                      style={styles.loginButton}
                      onPress={handleRegister}
                    >
                      <LinearGradient
                        colors={['rgba(255,255,255,0.9)', '#FFFFFF']}
                        style={styles.gradientButton}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={styles.loginButtonText}>Create Account</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.registerButton}
                      onPress={() => router.replace('/')}
                    >
                      <Text style={styles.registerButtonText}>Already have an account? Sign In</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      
      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onConfirm={() => {
          setAlertVisible(false);
          if (alertConfig.type === 'success') {
            router.replace('/');
          }
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  absoluteLogoContainer: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 20 : 10,
    marginBottom: 10,
    paddingTop: 30,
  },
  logo: {
    width: 250,  // Even smaller logo
    height: 220, // Even smaller logo
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 30,
  },
  contentContainerKeyboardOpen: {
    paddingTop: 10, // Reduced padding when keyboard is open
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitleText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 24,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 10,
    borderRadius: 8,
  },
  loader: {
    marginVertical: 20,
  },
  loginButton: {
    height: 55,
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  loginButtonText: {
    color: '#322e2e',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  registerButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
}); 