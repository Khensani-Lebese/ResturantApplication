import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomInput = ({
  value,
  onChangeText,
  placeholder,
  icon,
  error,
  secureTextEntry,
  showPassword,
  togglePassword,
  keyboardType = "default",
  autoCapitalize = "none",
}) => {
  return (
    <>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <Ionicons name={icon} size={20} color="#666666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#666666"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
        {togglePassword && (
          <TouchableOpacity 
            onPress={togglePassword}
            style={styles.eyeIcon}
          >
            <Ionicons 
              name={showPassword ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color="#666666" 
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    marginBottom: 12,
    paddingHorizontal: 25,
    height: 55,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputIcon: {
    marginRight: 15,
    opacity: 0.8,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#333333',
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 8,
    opacity: 0.8,
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  fieldError: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 12,
  },
});

export default CustomInput; 