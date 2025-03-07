import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  Alert,
  Image,
  TextInput,
  RefreshControl,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from './services/api';
import { useLocalSearchParams, useNavigation, router } from 'expo-router';
import { FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Navigator from './Navigator';
import { Colors } from './constants/colors';

export default function RestaurantListScreen() {
  const { token } = useLocalSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const fetchRestaurants = async () => {
    try {
      const response = await api.get('/restaurants', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRestaurants(response.data);
      setFilteredRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setError('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [token]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = restaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    } else {
      setFilteredRestaurants(restaurants);
    }
  }, [searchQuery, restaurants]);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => router.replace('/'), style: "destructive" }
      ]
    );
  };

  const showMenu = () => {
    setIsMenuVisible(true);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchRestaurants();
  }, []);

  const renderRestaurantCard = ({ item }) => (
    
    <TouchableOpacity 
      style={styles.restaurantCard} 
      onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: item._id, token })}
    >
      <Image
        source={{ uri: item.imageUrl || 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D0' }}
        style={styles.restaurantImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.restaurantName}>{item.name || 'Unnamed Restaurant'}</Text>
        <View style={styles.infoRow}>
          <Ionicons name="restaurant-outline" size={16} color={Colors.text.secondary} />
          <Text style={styles.cuisineText}>{item.cuisine || 'Cuisine not specified'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color={Colors.text.secondary} />
          <Text style={styles.locationText}>{item.location || 'Location not specified'}</Text>
        </View>
        {item.rating && (
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={Colors.warning} />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
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
    <LinearGradient
      colors={['#FF6B00', '#FF8C00']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Restaurants</Text>
          <TouchableOpacity onPress={showMenu} style={styles.logoutButton}>
            <Ionicons name="menu" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#FF6B00" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants, cuisine, or location..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="rgba(0,0,0,0.4)"
          />
        </View>

        <FlatList
          data={filteredRestaurants}
          keyExtractor={(item) => item._id?.toString()}
          renderItem={renderRestaurantCard}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor="#FFFFFF"
            />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />

        <FAB
          style={styles.fab}
          icon={() => <Ionicons name="book-outline" size={24} color={Colors.text.light} />}
          onPress={() => navigation.navigate('UserReservations', { token })}
          color={Colors.primary}
        />
      </SafeAreaView>

      <Navigator 
        isVisible={isMenuVisible} 
        onClose={() => setIsMenuVisible(false)}
        token={token}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  logoutButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 20,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
  },
  listContainer: {
    padding: 20,
  },
  restaurantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  restaurantImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cuisineText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666666',
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#FF6B00',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: Colors.primary,
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.text.light,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
}); 