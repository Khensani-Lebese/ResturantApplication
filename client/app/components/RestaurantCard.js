import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

// Use a URL for the placeholder image
const placeholderImage = 'https://cdn.pixabay.com/photo/2024/09/29/17/02/japan-contest-9083822_960_720.jpg'; // Example placeholder URL

const RestaurantCard = ({ restaurant, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image 
        source={{ uri: restaurant.imageUrl || placeholderImage }} 
        style={styles.image} 
        onError={(e) => {
          // If the image fails to load, set it to the placeholder
          e.target.src = placeholderImage;
        }}
      />
      <View style={styles.details}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
        <Text style={styles.location}>{restaurant.location}</Text>
        <Text style={styles.contact}>{restaurant.contact}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {restaurant.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  details: {
    padding: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#332e31', // Text color
  },
  cuisine: {
    fontSize: 14,
    color: '#cc866f', // Cuisine color
  },
  location: {
    fontSize: 14,
    color: '#666666', // Location color
  },
  contact: {
    fontSize: 14,
    color: '#666666', // Contact color
  },
  description: {
    fontSize: 12,
    color: '#999999', // Description color
  },
});

export default RestaurantCard; 