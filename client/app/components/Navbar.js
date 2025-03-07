import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Pressable, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { logout, fetchUserProfile, addProfileUpdateListener, removeProfileUpdateListener } from '../services/api';
import AnimatedTitle from './AnimatedTitle';

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
    
    // Add listener for profile updates
    addProfileUpdateListener(fetchUserData);
    
    // Cleanup
    return () => {
      removeProfileUpdateListener(fetchUserData);
    };
  }, []);

  const fetchUserData = async () => {
    try {
      const data = await fetchUserProfile();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const facts = [
    "Omakase (お任せ) means 'I leave it up to you' in Japanese 🍱",
    "The art of omakase dining can trace its roots back to ancient Japan ⛩️",
    "You've found our secret tap counter! Keep exploring! 🌟",
    "You're officially an Omakase superfan! 🏆"
  ];

  const menuItems = [
    {
      label: 'Profile',
      icon: 'person-outline',
      onPress: () => router.push('/Profile'),
    },
    {
      label: 'My Reservations',
      icon: 'calendar-outline',
      onPress: () => router.push('/UserReservations'),
    },
    {
      label: 'Settings',
      icon: 'settings-outline',
      onPress: () => router.push('/Settings'),
    },
    {
      label: 'Logout',
      icon: 'log-out-outline',
      onPress: logout,
    },
  ];

  return (
    <>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <AnimatedTitle 
            title="Omakase"
            facts={facts}
            factTriggers={[3, 5, 7, 10]}
          />
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity
            onPress={() => setShowMenu(!showMenu)}
            style={styles.profileButton}
          >
            {userData?.imageUrl ? (
              <Image 
                source={{ uri: userData.imageUrl }} 
                style={styles.profileImage}
              />
            ) : (
              <Ionicons name="person-circle-outline" size={40} color="#e4d4c6" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {showMenu && (
        <Pressable
          style={styles.overlay}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContainer}>
            <View style={styles.menu}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => {
                    item.onPress();
                    setShowMenu(false);
                  }}
                >
                  <Ionicons name={item.icon} size={24} color="#252228" />
                  <Text style={styles.menuText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    
    zIndex: 1,
    marginTop: 20,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    position: 'relative',
  },
  profileButton: {
    padding: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 50,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  menuContainer: {
    position: 'absolute',
    top: 70,
    right: 16,
    zIndex: 1000,
  },
  menu: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 8,
    minWidth: 220,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    marginVertical: 2,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  logo: {
    width: 60,
    height: 60,
    right: 13,
  },
}); 