import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ 
  value, 
  onChangeText, 
  placeholder = "Search...",
  placeholderTextColor = "rgba(0,0,0,0.4)",
  style
}) => {
  return (
    <View style={[styles.searchContainer, style]}>
      <View style={styles.searchIconContainer}>
        <Ionicons name="search-outline" size={20} color="rgba(0,0,0,0.4)" />
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={placeholderTextColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderColor: 'rgba(255, 107, 0, 0.3)',
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIconContainer: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    paddingRight: 20,
    fontSize: 16,
  },
});

export default SearchBar; 