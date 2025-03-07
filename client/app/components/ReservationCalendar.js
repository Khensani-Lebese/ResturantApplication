import React from 'react';
import { Calendar } from 'react-native-calendars';
import { StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

const ReservationCalendar = ({ markedDates, onDayPress, selectedDate }) => {
  return (
    <Calendar
      onDayPress={onDayPress}
      markedDates={{
        ...markedDates,
        [selectedDate]: { selected: true, marked: true, selectedColor: Colors.primary },
      }}
      style={styles.calendar}
      theme={{
        backgroundColor: Colors.background,
        calendarBackground: Colors.background,
        textSectionTitleColor: Colors.text.primary,
        selectedDayBackgroundColor: Colors.primary,
        selectedDayTextColor: '#ffffff',
        todayTextColor: Colors.primary,
        dayTextColor: Colors.text.secondary,
        textDisabledColor: '#d9e1e8',
        dotColor: Colors.success,
        arrowColor: Colors.primary,
        monthTextColor: Colors.text.primary,
        indicatorColor: Colors.primary,
      }}
    />
  );
};

const styles = StyleSheet.create({
  calendar: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});

export default ReservationCalendar; 