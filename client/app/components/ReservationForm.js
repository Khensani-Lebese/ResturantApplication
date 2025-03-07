import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Alert,
  ScrollView,
  TextInput,
  ActivityIndicator
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomNumberPicker from './CustomNumberPicker';
import { Colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { fetchUserProfile } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReservationForm = ({ onSubmit, restaurantName, restaurantId }) => {
  const [formData, setFormData] = useState({
    date: new Date(),
    time: '',
    guests: 1,
    name: '',
    email: '',
    phone: '',
    occasion: 'Regular Dining',
    specialRequests: '',
    seatingPreference: 'indoor',
    dietaryRestrictions: '',
    tablePreference: 'No Preference',
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [isDateValid, setIsDateValid] = useState(false);
  const [isTimeValid, setIsTimeValid] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  const occasions = [
    'Regular Dining',
    'Birthday',
    'Anniversary',
    'Business Meeting',
    'Date Night',
    'Special Celebration',
    'Other'
  ];

  const seatingOptions = [
    'Indoor',
    'Outdoor',
    'No Preference'
  ];

  const tablePreferences = [
    'Window Seat',
    'Booth',
    'Bar',
    'Private Room',
    'Outdoor',
    'Near Kitchen',
    'Quiet Area',
    'No Preference'
  ];

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        if (profile) {
          setFormData(prev => ({
            ...prev,
            name: profile.name || '',
            email: profile.email || '',
            phone: profile.phoneNumber || ''
          }));
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setLoadingProfile(false);
      }
    };
    loadUserProfile();
  }, []);

  useEffect(() => {
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setIsDateValid(selectedDate >= today);
  }, [formData.date]);

  const fetchAvailableTimeSlots = async (date) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Authentication Error', 'Please login again');
        return;
      }

      const response = await axios.get(
        `https://priority-i4dq.onrender.com/api/reservations/available-slots/${restaurantId}/${date.toISOString().split('T')[0]}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setAvailableTimeSlots(response.data.availableSlots || []);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      Alert.alert('Error', 'Could not fetch available time slots');
      setAvailableTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, date: selectedDate }));
      fetchAvailableTimeSlots(selectedDate);
    }
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setFormData(prev => ({ 
      ...prev, 
      time: timeSlot.time,
      timeSlot: timeSlot.time
    }));
    setIsTimeValid(true);
    setShowTimeModal(false);
  };

  const handleSubmit = async () => {
    try {
      if (!isDateValid || !isTimeValid) {
        Alert.alert('Invalid Date/Time', 'Please select a valid date and time');
        return;
      }

      if (!formData.name || !formData.email || !formData.phone) {
        Alert.alert('Missing Information', 'Please fill in all required fields');
        return;
      }

      setLoading(true);

      const reservationData = {
        restaurantId,
        date: formData.date.toISOString(),
        timeSlot: formData.time,
        time: formData.time,
        guests: parseInt(formData.guests),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        occasion: formData.occasion,
        specialRequests: formData.specialRequests || '',
        seatingPreference: formData.seatingPreference.toLowerCase(),
        dietaryRestrictions: formData.dietaryRestrictions || '',
        tablePreference: formData.tablePreference || 'No Preference'
      };

      await onSubmit(reservationData);
    } catch (error) {
      console.error('Reservation submission error:', error);
      Alert.alert(
        'Reservation Failed',
        error.message || 'Failed to make reservation. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity 
          style={styles.input} 
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.inputText}>
            {formData.date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={formData.date}
            mode="date"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Time</Text>
        <TouchableOpacity 
          style={styles.input} 
          onPress={() => setShowTimeModal(true)}
        >
          <Text style={styles.inputText}>
            {formData.time || 'Select Time'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showTimeModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Time</Text>
            {loading ? (
              <ActivityIndicator size="large" color={Colors.primary} />
            ) : availableTimeSlots.length > 0 ? (
              <ScrollView style={styles.timeSlotsContainer}>
                <View style={styles.timeSlotsList}>
                  {availableTimeSlots.map((slot, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.timeSlot,
                        !slot.available && styles.unavailableSlot,
                        selectedTimeSlot === slot && styles.selectedTimeSlot
                      ]}
                      onPress={() => slot.available && handleTimeSlotSelect(slot)}
                      disabled={!slot.available}
                    >
                      <Text style={[
                        styles.timeSlotText,
                        !slot.available && styles.unavailableText,
                        selectedTimeSlot === slot && styles.selectedTimeText
                      ]}>
                        {slot.time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <Text style={styles.noSlotsText}>No available time slots</Text>
            )}
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowTimeModal(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Number of Guests</Text>
        <CustomNumberPicker
          value={formData.guests}
          onChange={(value) => setFormData(prev => ({ ...prev, guests: value }))}
          min={1}
          max={20}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          placeholder="Your Name"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
          placeholder="Your Email"
          placeholderTextColor="#666"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={formData.phone}
          onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
          placeholder="Your Phone Number"
          placeholderTextColor="#666"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Occasion</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.occasionContainer}>
            {occasions.map((occasion) => (
              <TouchableOpacity
                key={occasion}
                style={[
                  styles.occasionButton,
                  formData.occasion === occasion && styles.selectedOccasion
                ]}
                onPress={() => setFormData(prev => ({ ...prev, occasion }))}
              >
                <Text style={[
                  styles.occasionText,
                  formData.occasion === occasion && styles.selectedOccasionText
                ]}>
                  {occasion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Seating Preference</Text>
        <View style={styles.seatingContainer}>
          {seatingOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.seatingButton,
                formData.seatingPreference.toLowerCase() === option.toLowerCase() && 
                styles.selectedSeating
              ]}
              onPress={() => setFormData(prev => ({ 
                ...prev, 
                seatingPreference: option.toLowerCase() 
              }))}
            >
              <Text style={[
                styles.seatingText,
                formData.seatingPreference.toLowerCase() === option.toLowerCase() && 
                styles.selectedSeatingText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Table Preference</Text>
        <View style={styles.tablePreferenceContainer}>
          {tablePreferences.map((preference) => (
            <TouchableOpacity
              key={preference}
              style={[
                styles.tablePreferenceButton,
                formData.tablePreference === preference && 
                styles.selectedTablePreference
              ]}
              onPress={() => setFormData(prev => ({ 
                ...prev, 
                tablePreference: preference 
              }))}
            >
              <Text style={[
                styles.tablePreferenceText,
                formData.tablePreference === preference && 
                styles.selectedTablePreferenceText
              ]}>
                {preference}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Dietary Restrictions</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.dietaryRestrictions}
          onChangeText={(text) => setFormData(prev => ({ 
            ...prev, 
            dietaryRestrictions: text 
          }))}
          placeholder="Any dietary restrictions?"
          placeholderTextColor="#666"
          multiline
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Special Requests</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.specialRequests}
          onChangeText={(text) => setFormData(prev => ({ 
            ...prev, 
            specialRequests: text 
          }))}
          placeholder="Any special requests?"
          placeholderTextColor="#666"
          multiline
        />
      </View>

      <TouchableOpacity 
        style={[
          styles.submitButton,
          (!isDateValid || !isTimeValid || loading) && styles.disabledButton
        ]} 
        onPress={handleSubmit}
        disabled={!isDateValid || !isTimeValid || loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.submitButtonText}>Make Reservation</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputText: {
    color: '#ffffff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#cc866f',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#666666',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  occasionContainer: {
    flexDirection: 'row',
  },
  occasionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedOccasion: {
    backgroundColor: '#cc866f',
    borderColor: '#cc866f',
  },
  occasionText: {
    color: '#ffffff',
  },
  selectedOccasionText: {
    fontWeight: 'bold',
  },
  seatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  seatingButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedSeating: {
    backgroundColor: '#cc866f',
    borderColor: '#cc866f',
  },
  seatingText: {
    color: '#ffffff',
  },
  selectedSeatingText: {
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  timeSlotsContainer: {
    marginVertical: 10,
  },
  timeSlotsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
  },
  timeSlot: {
    padding: 10,
    margin: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(204, 134, 111, 0.2)',
    minWidth: 100,
    alignItems: 'center',
  },
  unavailableSlot: {
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
  },
  selectedTimeSlot: {
    backgroundColor: '#cc866f',
  },
  timeSlotText: {
    color: '#cc866f',
    fontSize: 16,
  },
  selectedTimeText: {
    color: '#ffffff',
  },
  unavailableText: {
    color: '#666666',
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#cc866f',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  tablePreferenceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  tablePreferenceButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 20,
    margin: 4,
    minWidth: '45%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  selectedTablePreference: {
    backgroundColor: '#cc866f',
    borderColor: '#cc866f',
  },
  tablePreferenceText: {
    color: '#ffffff',
    fontSize: 14,
  },
  selectedTablePreferenceText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  noSlotsText: {
    textAlign: 'center',
    padding: 20,
    color: '#666666',
  }
});

export default ReservationForm;
