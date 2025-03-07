import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, SafeAreaView, ImageBackground } from 'react-native';
import api, { fetchReservationDetails } from './services/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import CustomButton from './components/CustomButton';
import { Colors } from './constants/colors';
import { Ionicons } from '@expo/vector-icons';

const backgroundImage = 'https://images.pexels.com/photos/5086628/pexels-photo-5086628.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
const defaultRestaurantImage = 'https://cdn.pixabay.com/photo/2024/09/29/17/02/restaurant-9083831_1280.jpg';

const ReservationDetailScreen = () => {
  const { reservationId, token } = useLocalSearchParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPayPal, setShowPayPal] = useState(false);
  const [paypalUrl, setPaypalUrl] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const reservationData = await fetchReservationDetails(reservationId);
        setReservation(reservationData);
      } catch (error) {
        setError('Failed to load reservation details');
        console.error('Error fetching reservation details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [reservationId]);

  const handlePayment = async () => {
    try {
      console.log('Initiating payment for reservation:', reservationId);
      const response = await api.post('/payments/create-order', {
        amount: reservation.guests * reservation.basePrice,
        reservationId: reservationId,
        currency: 'USD',
        description: `Reservation at ${reservation.restaurantId?.name || 'Restaurant'}`
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Payment creation response:', response.data);
      
      if (response.data && response.data.approvalUrl) {
        setPaypalUrl(response.data.approvalUrl);
        setShowPayPal(true);
      } else {
        throw new Error('No approval URL received from server');
      }
    } catch (error) {
      console.error('Payment initialization error:', error.message);
      Alert.alert(
        'Payment Error',
        error.message || 'Failed to initialize payment. Please try again.'
      );
    }
  };

  const handlePayPalNavigationStateChange = async (state) => {
    try {
      if (state.url.includes('/payment/success') && !isCapturing) {
        setIsCapturing(true);
        const urlParams = new URLSearchParams(state.url.split('?')[1]);
        const orderId = urlParams.get('token');
        const payerId = urlParams.get('PayerID');

        console.log('Payment success:', { orderId, payerId });

        if (!orderId || !payerId) {
          throw new Error('Missing payment details');
        }

        try {
          const captureResponse = await api.post('/payments/capture-order', {
            orderId,
            payerId,
            reservationId: reservationId
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });

          console.log('Payment capture response:', captureResponse.data);

          setShowPayPal(false);
          setReservation(prev => ({ ...prev, paymentStatus: 'completed' }));
          Alert.alert('Success', 'Payment completed successfully!');
        } catch (error) {
          if (error.response?.data?.message?.includes('ORDER_ALREADY_CAPTURED')) {
            setShowPayPal(false);
            setReservation(prev => ({ ...prev, paymentStatus: 'completed' }));
            Alert.alert('Success', 'Payment completed successfully!');
          } else {
            throw error;
          }
        }
      } else if (state.url.includes('/payment/cancel')) {
        setShowPayPal(false);
        setIsCapturing(false);
        Alert.alert('Payment Cancelled', 'You have cancelled the payment process.');
      }
    } catch (error) {
      console.error('Payment processing error:', error.response?.data || error.message);
      setShowPayPal(false);
      setIsCapturing(false);
      Alert.alert(
        'Payment Error',
        'Failed to process payment. Please try again.'
      );
    }
  };

  const handleCancelReservation = () => {
    Alert.alert(
      'Cancel Reservation',
      'Are you sure you want to cancel this reservation?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: confirmCancelReservation,
        },
      ],
    );
  };

  const confirmCancelReservation = async () => {
    try {
      const response = await api.delete(`/reservations/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (reservation.paymentStatus === 'completed') {
        // Send refund request email
        await api.post('/reservations/request-refund', {
          reservationId,
          email: reservation.email,
          amount: reservation.guests * reservation.basePrice,
          restaurantName: reservation.restaurantId?.name,
          date: reservation.date,
          timeSlot: reservation.timeSlot
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        Alert.alert(
          'Reservation Cancelled',
          'Your reservation has been cancelled. A refund request has been sent to our team and you will receive an email with further instructions.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert(
          'Reservation Cancelled',
          'Your reservation has been cancelled successfully.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    } catch (error) {
      console.error('Cancel reservation error:', error);
      Alert.alert(
        'Error',
        'Failed to cancel reservation. Please try again.'
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'cancelled':
        return Colors.danger;
      case 'confirmed':
        return Colors.success;
      default:
        return Colors.primary;
    }
  };

  if (showPayPal) {
    return (
      <WebView
        source={{ uri: paypalUrl }}
        onNavigationStateChange={handlePayPalNavigationStateChange}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={styles.loader}
          />
        )}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
          Alert.alert(
            'Error',
            'Failed to load payment page. Please try again.',
            [
              {
                text: 'OK',
                onPress: () => setShowPayPal(false)
              }
            ]
          );
        }}
      />
    );
  }

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
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Reservation Details</Text>
          </View>

          <View style={[styles.card, reservation.status === 'cancelled' && styles.cancelledCard]}>
            {reservation.status === 'cancelled' && (
              <View style={styles.cancelledBanner}>
                <Ionicons name="close-circle" size={24} color="#fff" />
                <Text style={styles.cancelledText}>Reservation Cancelled</Text>
              </View>
            )}

            <ImageBackground 
              source={{ uri: reservation.restaurantId?.image || defaultRestaurantImage }} 
              style={[
                styles.restaurantImage,
                reservation.status === 'cancelled' && styles.cancelledImage
              ]}
              defaultSource={{ uri: defaultRestaurantImage }}
            >
              <View style={styles.overlay}>
                <View style={styles.contentContainer}>
                  <View style={styles.restaurantSection}>
                    <Text style={[styles.restaurantName, styles.lightText]}>
                      {reservation.restaurantId?.name || 'Restaurant'}
                    </Text>
                    <View style={[styles.statusBadge, 
                      { backgroundColor: getStatusColor(reservation.status) }]}>
                      <Text style={styles.statusText}>
                        {reservation.status?.charAt(0).toUpperCase() + 
                         reservation.status?.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </ImageBackground>

            <View style={styles.detailsSection}>
              <View style={styles.sectionTitle}>
                <Ionicons name="information-circle-outline" size={24} color={Colors.primary} />
                <Text style={styles.sectionTitleText}>Reservation Information</Text>
              </View>

              <View style={styles.detailsGrid}>
                <View style={styles.detailBlock}>
                  <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
                    <Text style={styles.labelText}>Date</Text>
                  </View>
                  <Text style={styles.valueText}>
                    {new Date(reservation.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </View>

                <View style={styles.detailBlock}>
                  <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={20} color={Colors.primary} />
                    <Text style={styles.labelText}>Time</Text>
                  </View>
                  <Text style={styles.valueText}>{reservation.timeSlot}</Text>
                </View>

                <View style={styles.detailBlock}>
                  <View style={styles.infoRow}>
                    <Ionicons name="people-outline" size={20} color={Colors.primary} />
                    <Text style={styles.labelText}>Party Size</Text>
                  </View>
                  <Text style={styles.valueText}>
                    {reservation.guests} {reservation.guests === 1 ? 'Guest' : 'Guests'}
                  </Text>
                </View>

                <View style={styles.detailBlock}>
                  <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={20} color={Colors.primary} />
                    <Text style={styles.labelText}>Reserved By</Text>
                  </View>
                  <Text style={styles.valueText}>{reservation.name}</Text>
                </View>

                <View style={styles.detailBlock}>
                  <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={20} color={Colors.primary} />
                    <Text style={styles.labelText}>Contact</Text>
                  </View>
                  <Text style={styles.valueText}>{reservation.phone}</Text>
                </View>

                <View style={styles.detailBlock}>
                  <View style={styles.infoRow}>
                    <Ionicons name="mail-outline" size={20} color={Colors.primary} />
                    <Text style={styles.labelText}>Email</Text>
                  </View>
                  <Text style={styles.valueText}>{reservation.email}</Text>
                </View>
              </View>

              {(reservation.occasion || reservation.seatingPreference || reservation.specialRequests) && (
                <View style={styles.additionalDetails}>
                  <View style={styles.sectionTitle}>
                    <Ionicons name="list-outline" size={24} color={Colors.primary} />
                    <Text style={styles.sectionTitleText}>Additional Details</Text>
                  </View>

                  {reservation.occasion && (
                    <View style={styles.detailBlock}>
                      <View style={styles.infoRow}>
                        <Ionicons name="gift-outline" size={20} color={Colors.primary} />
                        <Text style={styles.labelText}>Occasion</Text>
                      </View>
                      <Text style={styles.valueText}>{reservation.occasion}</Text>
                    </View>
                  )}

                  {reservation.seatingPreference && (
                    <View style={styles.detailBlock}>
                      <View style={styles.infoRow}>
                        <Ionicons name="restaurant-outline" size={20} color={Colors.primary} />
                        <Text style={styles.labelText}>Seating Preference</Text>
                      </View>
                      <Text style={styles.valueText}>{reservation.seatingPreference}</Text>
                    </View>
                  )}

                  {reservation.specialRequests && (
                    <View style={styles.detailBlock}>
                      <View style={styles.infoRow}>
                        <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
                        <Text style={styles.labelText}>Special Requests</Text>
                      </View>
                      <Text style={styles.valueText}>{reservation.specialRequests}</Text>
                    </View>
                  )}
                </View>
              )}

              <View style={styles.paymentSection}>
                <View style={styles.sectionTitle}>
                  <Ionicons name="card-outline" size={24} color={Colors.primary} />
                  <Text style={styles.sectionTitleText}>Payment Details</Text>
                </View>
                
                <View style={styles.paymentDetails}>
                  <Text style={styles.amount}>
                    Base Price per Guest: ${reservation.basePrice}
                  </Text>
                  <Text style={styles.amount}>
                    Total Amount: ${reservation.guests * reservation.basePrice}
                  </Text>
                  <Text style={[
                    styles.paymentStatus,
                    reservation.status === 'cancelled' && styles.cancelledText
                  ]}>
                    Status: {reservation.status === 'cancelled' ? 'Refund Requested' : 
                            reservation.paymentStatus?.charAt(0).toUpperCase() + 
                            reservation.paymentStatus?.slice(1)}
                  </Text>
                </View>

                {reservation.status !== 'cancelled' && 
                 reservation.paymentStatus !== 'completed' && (
                  <CustomButton
                    title="Pay Now"
                    onPress={handlePayment}
                    style={styles.payButton}
                  />
                )}
                {reservation.paymentStatus === 'completed' && (
                  <View style={styles.paymentComplete}>
                    <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
                    <Text style={styles.paymentCompleteText}>Payment Completed</Text>
                  </View>
                )}
              </View>

              {reservation.status !== 'cancelled' && (
                <View style={styles.cancelSection}>
                  <CustomButton
                    title="Cancel Reservation"
                    onPress={handleCancelReservation}
                    style={styles.cancelButton}
                    textStyle={styles.cancelButtonText}
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    margin: 16,
    shadowColor: Colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: '100%',
    height: 200,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    padding: 16,
  },
  restaurantSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  detailsSection: {
    padding: 20,
    backgroundColor: Colors.card,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 8,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailBlock: {
    width: '48%',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  valueText: {
    fontSize: 16,
    color: Colors.text.primary,
    marginTop: 4,
    fontWeight: '500',
  },
  additionalDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  paymentSection: {
    padding: 20,
    backgroundColor: Colors.card,
  },
  paymentDetails: {
    marginBottom: 16,
  },
  amount: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  paymentStatus: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 8,
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
  payButton: {
    marginTop: 12,
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
  loader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentComplete: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: Colors.success + '20', // Add slight transparency
    borderRadius: 8,
  },
  paymentCompleteText: {
    marginLeft: 8,
    color: Colors.success,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelButton: {
    backgroundColor: Colors.danger + '20',
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  cancelButtonText: {
    color: Colors.danger,
    fontWeight: '600',
  },
  cancelledCard: {
    opacity: 0.9,
  },
  cancelledImage: {
    opacity: 0.7,
  },
  cancelledBanner: {
    backgroundColor: Colors.danger,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cancelledText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReservationDetailScreen; 