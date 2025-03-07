import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { Colors } from './constants/colors';
import api from './services/api';

export default function PaymentScreen() {
  const { reservationId, amount, token, restaurantName } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [paypalUrl, setPaypalUrl] = useState(null);
  const router = useRouter();

  const initiatePayment = async () => {
    try {
      setLoading(true);
      const response = await api.post('/payments/create-order', {
        amount,
        reservationId,
        description: `Reservation at ${restaurantName}`
      });
      setPaypalUrl(response.data.approvalUrl);
    } catch (error) {
      console.error('Payment initiation error:', error);
      Alert.alert('Error', 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    initiatePayment();
  }, []);

  const handleNavigationStateChange = async (state) => {
    if (state.url.includes('/payment/success')) {
      try {
        const urlParams = new URLSearchParams(state.url.split('?')[1]);
        const paypalOrderId = urlParams.get('token');
        const PayerID = urlParams.get('PayerID');

        if (!paypalOrderId || !PayerID) {
          throw new Error('Missing PayPal response parameters');
        }

        setLoading(true);
        
        const response = await api.post('/payments/capture-order', {
          orderId: paypalOrderId,
          payerId: PayerID,
          reservationId
        });

        if (response.data.status === 'success') {
          Alert.alert(
            'Success',
            'Payment completed successfully!',
            [
              {
                text: 'OK',
                onPress: () => router.replace('/UserReservations')
              }
            ]
          );
        } else {
          throw new Error('Payment capture failed');
        }
      } catch (error) {
        console.error('Payment capture error:', error);
        Alert.alert(
          'Error',
          'Payment was processed but confirmation failed. Please contact support.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/UserReservations')
            }
          ]
        );
      } finally {
        setLoading(false);
      }
    } else if (state.url.includes('/payment/cancel')) {
      Alert.alert(
        'Payment Cancelled',
        'You have cancelled the payment',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Initializing payment...</Text>
      </View>
    );
  }

  if (paypalUrl) {
    return (
      <WebView
        source={{ uri: paypalUrl }}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>Failed to load payment page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    
  },
  loadingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.text.primary,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 16,
  }
}); 