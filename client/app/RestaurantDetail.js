import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, Image, Animated, Linking, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from './constants/colors';
import api, { fetchRestaurantDetails } from './services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import RestaurantHeader from './components/RestaurantHeader';
import QuickInfo from './components/QuickInfo';
import MenuPreview from './components/MenuPreview';

const RestaurantDetailScreen = () => {
  const { restaurantId, token } = useLocalSearchParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  
  const image = 'https://cdn.pixabay.com/photo/2024/09/29/17/02/windows-9083830_960_720.jpg'; // Placeholder for restaurant image

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const restaurantData = await fetchRestaurantDetails(restaurantId);
        setRestaurant(restaurantData);
      } catch (error) {
        setError('Failed to load restaurant details');
        Alert.alert('Error', error.message || 'Could not load restaurant details. Please try again.');
        console.error('Error fetching restaurant details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [restaurantId]);


  const handleReservePress = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      const authToken = token || storedToken;

      if (!authToken) {
        Alert.alert(
          'Authentication Required',
          'Please log in to make a reservation',
          [
            {
              text: 'OK',
              onPress: () => router.push('/Login')
            }
          ]
        );
        return;
      }

      router.push({
        pathname: '/Reservation',
        params: {
          restaurantId: restaurantId,
          restaurantName: restaurant?.name,
          token: authToken,
          basePrice: restaurant?.pricing?.basePrice || 0
        }
      });
    } catch (error) {
      console.error('Error in handleReservePress:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleCallPress = async () => {
    if (!restaurant?.contact) {
      Alert.alert('Error', 'No contact number available');
      return;
    }

    // Remove any non-numeric characters from the phone number
    const phoneNumber = restaurant.contact.replace(/\D/g, '');
    
    try {
      const supported = await Linking.canOpenURL(`tel:${phoneNumber}`);
      
      if (supported) {
        await Linking.openURL(`tel:${phoneNumber}`);
      } else {
        Alert.alert('Error', 'Phone calls are not supported on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not make phone call');
    }
  };

  const formatOpeningHours = (hours) => {
    if (!hours) return 'Hours not available';
    return `${hours.open} - ${hours.close}`;
  };

  const getDayOfWeek = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    return days[today];
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
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

  if (!restaurant) {
    return <Text style={styles.errorText}>Restaurant not found</Text>;
  }

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: 'https://cdn.pixabay.com/video/2024/11/03/239700_large.mp4' }}
        style={styles.video}
        resizeMode="cover"
        shouldPlay
        isLooping
        isMuted
      />
      <View style={styles.overlay} />
      
      <ScrollView style={styles.scrollView}>
        <Image
          source={{ uri: image }}
          style={styles.image}
        />
        
        <View style={styles.contentContainer}>
          <RestaurantHeader restaurant={restaurant} />
          <QuickInfo 
            restaurant={restaurant} 
            formatOpeningHours={formatOpeningHours}
            getDayOfWeek={getDayOfWeek}
          />
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{restaurant.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.description}>{restaurant.location}</Text>
          </View>

          <MenuPreview menu={restaurant.menu} />

          {/* Contact and Actions */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleCallPress}>
              <Ionicons name="call" size={24} color="#e4d4c6" />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]} 
              onPress={handleReservePress}
            >
              <Text style={styles.primaryButtonText}>Reserve a Table</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000'
  },
  video: {
    position: 'absolute',
    top: 130,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    width: '100%',
    backgroundColor: '#000'
  },
  overlay: {
    position: 'absolute',
    top: 130,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Adjust opacity as needed (0.5 = 50% transparent)
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
    zIndex: 2, // Increased to be above both video and overlay
  },
  headerImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginTop: -10,
    padding: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#e4d4c6',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  cuisine: {
    fontSize: 18,
    color: '#e4d4c6',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#e4d4c6',
    marginLeft: 4,
    fontSize: 16,
  },
  quickInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: 'rgba(37, 34, 40, 0.9)',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  infoText: {
    color: '#e4d4c6',
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e4d4c6',
    marginBottom: 12,
  },
  description: {
    color: '#e4d4c6',
    lineHeight: 24,
  },
  menuItem: {
    backgroundColor: 'rgba(37, 34, 40, 0.9)',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 150,
  },
  menuItemName: {
    color: '#e4d4c6',
    fontSize: 16,
    marginBottom: 4,
  },
  menuItemPrice: {
    color: '#e4d4c6',
    fontSize: 14,
  },
  location: {
    color: '#e4d4c6',
    marginBottom: 12,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(37, 34, 40, 0.9)',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#cc866f',
    flex: 2,
  },
  actionButtonText: {
    color: '#e4d4c6',
    marginLeft: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.text.light,
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  image: {
    width: '100%',
    height: 200, // Adjust height as needed
    marginBottom: 10,
  },
});

export default RestaurantDetailScreen; 