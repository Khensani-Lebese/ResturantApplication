import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  ImageBackground 
} from 'react-native';
import axios from 'axios';
import { Colors } from './constants/colors';
import RestaurantCard from './components/RestaurantCard'; 
import { useNavigation } from 'expo-router';
import Navigator from './Navigator'; // Import the Navigator component
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { fetchRestaurants } from './services/api';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import PromoBanner from './components/PromoBanner';
import CuisineFilter from './components/CuisineFilter';

// URL for the background image
const backgroundImage = 'https://res.cloudinary.com/dmdmv15pl/image/upload/v1741251194/splash_1_v93eis.png';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNavigatorVisible, setNavigatorVisible] = useState(false);
  const [token, setToken] = useState(null); // State to hold the token
  const navigation = useNavigation();
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [cuisines, setCuisines] = useState([]);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('userToken');
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const data = await fetchRestaurants();
        setRestaurants(data);
        setFilteredRestaurants(data);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError('Failed to load restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, []);

  useEffect(() => {
    if (restaurants.length > 0) {
      const uniqueCuisines = [...new Set(restaurants.map(restaurant => restaurant.cuisine))];
      setCuisines(uniqueCuisines);
    }
  }, [restaurants]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    filterRestaurants(text, selectedCuisine);
  };

  const handleCuisineFilter = (cuisine) => {
    setSelectedCuisine(cuisine);
    filterRestaurants(searchQuery, cuisine);
  };

  const filterRestaurants = (text, cuisine) => {
    let filtered = restaurants;
    
    if (text) {
      filtered = filtered.filter(restaurant => 
        restaurant.name.toLowerCase().includes(text.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(text.toLowerCase()) ||
        restaurant.location.toLowerCase().includes(text.toLowerCase())
      );
    }
    
    if (cuisine) {
      filtered = filtered.filter(restaurant => 
        restaurant.cuisine === cuisine
      );
    }
    
    setFilteredRestaurants(filtered);
  };

  const renderRestaurantItem = ({ item }) => (
    <RestaurantCard 
      restaurant={item} 
      onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: item._id })}
    />
  );

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

  return (
    <ImageBackground source={{ uri: backgroundImage }} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Navbar />
        <View style={styles.content}>
          <CuisineFilter
            selectedCuisine={selectedCuisine}
            onSelectCuisine={handleCuisineFilter}
            cuisines={cuisines}
          />
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search restaurants, cuisine, or location..."
            style={styles.searchContainer}
          />
          <PromoBanner />
          <FlatList
            data={filteredRestaurants}
            keyExtractor={(item) => item._id?.toString()}
            renderItem={renderRestaurantItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <Navigator isVisible={isNavigatorVisible} onClose={() => setNavigatorVisible(false)} token={token} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',

  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    flex: 1,
    paddingTop: 0,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 15,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.danger,
    fontSize: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  restaurantCard: {
    marginBottom: 20,
  },
});

export default RestaurantList;