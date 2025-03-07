import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

const CuisineFilter = ({ selectedCuisine, onSelectCuisine, cuisines }) => {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            !selectedCuisine && styles.selectedChip
          ]}
          onPress={() => onSelectCuisine(null)}
        >
          <Text style={[
            styles.chipText,
            !selectedCuisine && styles.selectedChipText
          ]}>All</Text>
        </TouchableOpacity>
        
        {cuisines.map((cuisine) => (
          <TouchableOpacity
            key={cuisine}
            style={[
              styles.filterChip,
              selectedCuisine === cuisine && styles.selectedChip
            ]}
            onPress={() => onSelectCuisine(cuisine)}
          >
            <Text style={[
              styles.chipText,
              selectedCuisine === cuisine && styles.selectedChipText
            ]}>{cuisine}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(228, 212, 198, 0.3)',
  },
  selectedChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    color: '#e4d4c6',
    fontSize: 14,
  },
  selectedChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default CuisineFilter; 