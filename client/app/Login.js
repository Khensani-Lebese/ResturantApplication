import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import CustomInput from './components/CustomInput';
import { validateEmail, validatePassword } from './utils/validation';
import { login } from './services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from './components/CustomAlert';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Keyboard, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const router = useRouter();
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
  
    const handleLogin = async () => {
        // Reset errors
        setError('');
        setEmailError('');
        setPasswordError('');
        
        // Validate inputs
        const emailValidationError = validateEmail(email);
        const passwordValidationError = validatePassword(password);
        
        setEmailError(emailValidationError);
        setPasswordError(passwordValidationError);
    
        if (emailValidationError || passwordValidationError) {
          return;
        }
    
        setLoading(true);
        try {
          const credentials = {
            email,
            password,
          };
    
          const response = await login(credentials);
          
          // Store the token and user info
          await AsyncStorage.setItem('userToken', response.token);
          await AsyncStorage.setItem('userRole', response.role);
          await AsyncStorage.setItem('userData', JSON.stringify(response.user));
          console.log('Token:', response.token);
          console.log('Role:', response.role);
          console.log('User Data:', response.user);
          
          setAlertConfig({
            title: 'Success!',
            message: 'Login successful! Redirecting...',
            type: 'success'
          });
          setAlertVisible(true);
    
          // Navigate after a short delay
          setTimeout(() => {
            router.replace('/RestaurantList');
          }, 1500);
    
          console.log('Token:', response.token);
    
        } catch (error) {
          Alert.alert('Login Error', error.message || 'Invalid credentials. Please try again.');
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
              <Text style={styles.welcomeText}>Welcome Back!</Text>
              <Text style={styles.subtitleText}>Sign in to continue</Text>
              
              <View style={styles.formContainer}>
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
                  editable={!loading}
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
                  editable={!loading}
                />

                {error ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                <TouchableOpacity 
                  style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.9)', '#FFFFFF']}
                    style={styles.gradientButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#FF6B00" />
                    ) : (
                      <Text style={styles.loginButtonText}>Sign In</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
                
                <Link href="/Register" asChild>
                  <TouchableOpacity 
                    style={styles.registerButton}
                    disabled={loading}
                  >
                    <Text style={[
                      styles.registerButtonText,
                      loading && styles.registerButtonTextDisabled
                    ]}>
                      New user? Create Account
                    </Text>
                  </TouchableOpacity>
                </Link>
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
          if (alertConfig.type === 'error') {
            setError(alertConfig.message);
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
  },
  logo: {
    width: 250,
    height: 250,
    marginTop: 40,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  contentContainerKeyboardOpen: {
    paddingTop: 10,
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
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
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
  loginButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonTextDisabled: {
    opacity: 0.7,
  },
});