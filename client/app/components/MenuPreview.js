import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function MenuPreview({ menu }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Popular Items</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {menu?.map((item, index) => (
          <View key={index} style={styles.menuItem}>
            <Text style={styles.menuItemName}>{item.item}</Text>
            <Text style={styles.menuItemPrice}>${item.price}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e4d4c6',
    marginBottom: 12,
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
}); 