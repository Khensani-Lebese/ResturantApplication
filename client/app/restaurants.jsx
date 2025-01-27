import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'; // Import icon libraries

export default function RestaurantListScreen() {
  const { token } = useLocalSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const numColumns = 2; // Define the number of columns

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        console.log('Fetching restaurants with token:', token);
        const response = await axios.get(
          'https://restaurant-server-5htc.onrender.com/api/restaurants',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Restaurant data received:', response.data);
        setRestaurants(response.data);
        setError(null);
      } catch (error) {
        console.error('Error details:', error.response || error);
        setError(
          error.response?.data?.message || 'Failed to fetch restaurants'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [token]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!restaurants || restaurants.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text>No restaurants found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={restaurants}
        numColumns={numColumns} // Set the number of columns
        key={numColumns} // Add the key prop to force re-render
        keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.restaurantItem}>
            <Text style={styles.restaurantName}>
              {item.name || 'Unnamed Restaurant'}
            </Text>
            <Text>{item.cuisine || 'Cuisine not specified'}</Text>
            <Text>{item.location || 'Location not specified'}</Text>

            {/* Icons with hover labels */}
            <View style={styles.iconContainer}>
              {/* WiFi Icon */}
              <TouchableOpacity
                style={styles.iconWrapper}
                onPress={() => console.log('WiFi')}
              >
                <FontAwesome name="wifi" size={20} color="black" />
                <Text style={styles.iconLabel}>WiFi</Text>
              </TouchableOpacity>

              {/* Smoking Icon */}
              <TouchableOpacity
                style={styles.iconWrapper}
                onPress={() => console.log('Smoking Section')}
              >
                <MaterialIcons name="smoking-rooms" size={20} color="black" />
                <Text style={styles.iconLabel}>Smoking Section</Text>
              </TouchableOpacity>

              {/* Catering Icon */}
              <TouchableOpacity
                style={styles.iconWrapper}
                onPress={() => console.log('Outside Catering')}
              >
                <MaterialIcons name="restaurant" size={20} color="black" />
                <Text style={styles.iconLabel}>Outside Catering</Text>
              </TouchableOpacity>
            </View>

            {/* View Restaurant Button */}
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() =>
                navigation.navigate('RestaurantDetail', {
                  restaurantId: item._id,
                  token,
                })
              }
            >
              <Text style={styles.viewButtonText}>View Restaurant</Text>
            </TouchableOpacity>
          </View>
        )}
        columnWrapperStyle={styles.columnWrapper} // Custom styling for the row
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between', // Space out the items evenly
  },
  restaurantItem: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    position: 'relative', // Enable relative positioning for absolute children
    height: 220, // Adjust height for icons
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  iconWrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  iconLabel: {
    fontSize: 10,
    color: '#555',
    marginTop: 4,
  },
  viewButton: {
    position: 'absolute', // Position absolutely within the card
    bottom: 10, // Set distance from the bottom
    right: 10, // Set distance from the right
    paddingVertical: 10, // Increased padding for a luxurious feel
    paddingHorizontal: 20, // More horizontal padding
    borderRadius: 20, // Rounded corners for a smooth look
    backgroundColor: '#FF6F61', // Subtle luxury background
    elevation: 4, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  viewButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16, // Larger font size for elegance
    letterSpacing: 1, // Slight letter spacing
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});
