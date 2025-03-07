import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SectionList, ImageBackground, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import api from './services/api';
import ReservationCalendar from './components/ReservationCalendar';
import ReservationCard from './components/ReservationCard';
import { Colors } from './constants/colors';

// URL for the background image
const backgroundImage = 'https://res.cloudinary.com/dmdmv15pl/image/upload/v1741251194/splash_1_v93eis.png';

// Default restaurant image if none is provided
const defaultRestaurantImage = 'https://cdn.pixabay.com/photo/2024/09/29/17/02/soup-9083825_960_720.jpg';

const UserReservations = () => {
  const { token } = useLocalSearchParams(); // Get token from params
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Set default to today's date
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [isCalendarVisible, setIsCalendarVisible] = useState(true); // State to manage calendar visibility
  const navigation = useNavigation();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await api.get('/user/reservations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReservations(response.data);
        setError(null);
        markDatesWithReservations(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch reservations');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [token]);

  const markDatesWithReservations = (reservations) => {
    const dates = {};
    reservations.forEach(reservation => {
      const date = new Date(reservation.date).toISOString().split('T')[0]; // Format date as YYYY-MM-DD
      dates[date] = { marked: true, dotColor: Colors.success }; // Mark the date with a green dot
    });
    setMarkedDates(dates);
  };

  useEffect(() => {
    if (selectedDate) {
      const filtered = reservations.filter(reservation => {
        const reservationDate = new Date(reservation.date).toISOString().split('T')[0];
        return reservationDate === selectedDate;
      });
      setFilteredReservations(filtered);
    }
  }, [selectedDate, reservations]);

  const renderReservationItem = ({ item }) => (
    <ReservationCard 
      item={item} 
      onPress={() => navigation.navigate('ReservationDetail', { reservationId: item._id, token })}
    />
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
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
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Reservations</Text>
          <TouchableOpacity onPress={() => setIsCalendarVisible(prev => !prev)}>
            <Ionicons 
              name={isCalendarVisible ? "calendar-outline" : "calendar-sharp"} 
              size={24} 
              color={Colors.primary} 
            />
          </TouchableOpacity>
        </View>

        {isCalendarVisible && (
          <ReservationCalendar 
            markedDates={markedDates} 
            onDayPress={(day) => setSelectedDate(day.dateString)} 
            selectedDate={selectedDate} 
          />
        )}

        {filteredReservations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No reservations found for this date</Text>
          </View>
        ) : (
          <SectionList
            sections={[{ title: selectedDate, data: filteredReservations }]}
            renderItem={renderReservationItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={true}
          />
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  listContainer: {
    padding: 20,
  },
  card: {
    borderRadius: 15,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: '100%',
    height: 200, // Increased height for better visual
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for better text visibility
    justifyContent: 'flex-end', // Align content to bottom
  },
  contentContainer: {
    padding: 16,
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginLeft: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.light,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.text.tertiary,
    marginTop: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 16,
    textAlign: 'center',
  },
  lightText: {
    color: '#fff', // Make text white for better contrast
  },
  sectionHeader: {
    backgroundColor: 'rgba(37, 34, 40, 0.9)',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    marginHorizontal: 20,
  },
  sectionHeaderText: {
    color: '#e4d4c6',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserReservations; 