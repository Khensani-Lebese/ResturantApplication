import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Modal, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { logout } from './services/api';

const { height, width } = Dimensions.get('window');

export default function Navigator({ isVisible, onClose }) {
  const menuItems = [
    {
      title: 'Profile',
      icon: 'person-outline',
      description: 'View and edit your profile',
      onPress: () => {
        router.push('/Profile');
        onClose();
      },
      color: '#32ADE6'
    },
    {
      title: 'Restaurants',
      icon: 'restaurant-outline',
      description: 'Explore restaurants near you',
      onPress: () => {
        router.push('/restaurants');
        onClose();
      },
      color: '#FF9500'
    },
    {
      title: 'My Reservations',
      icon: 'book-outline',
      description: 'Manage your bookings',
      onPress: () => {
        router.push('/UserReservations');
        onClose();
      },
      color: '#007AFF'
    },
    {
      title: 'Add Restaurant',
      icon: 'book-outline',
      description: 'Manage your bookings',
      onPress: () => {
        router.push('/AddRestaurantScreen');
        onClose();
      },
      color: '#007AFF'
    },
    {
      title: 'Security',
      icon: 'shield-checkmark-outline',
      description: 'Manage your account security',
      onPress: () => {
        router.push('/security');
        onClose();
      },
      color: '#5856D6'
    },
    {
      title: 'Help & Support',
      icon: 'help-circle-outline',
      description: 'Get assistance and support',
      onPress: () => {
        router.push('/support');
        onClose();
      },
      color: '#34C759'
    },
    {
      title: 'Logout',
      icon: 'log-out-outline',
      description: 'Sign out of your account',
      onPress: async () => {
        await logout();
        router.replace('/');
        onClose();
      },
      color: '#FF3B30'
    }
  ];

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={20} style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centeredContainer}>
            <View style={styles.menuContainer}>
              <View style={styles.pullBar} />
              
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Menu</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.scrollView}>
                {menuItems.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.menuItem,
                      index === menuItems.length - 1 && styles.lastMenuItem
                    ]}
                    onPress={item.onPress}
                  >
                    <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
                      <Ionicons name={item.icon} size={24} color={item.color} />
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={styles.menuTitle}>{item.title}</Text>
                      <Text style={styles.menuDescription}>{item.description}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  safeArea: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  menuContainer: {
    width: '90%',
    maxHeight: height * 0.7,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  pullBar: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    marginVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lastMenuItem: {
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: '#666666',
  },
}); 