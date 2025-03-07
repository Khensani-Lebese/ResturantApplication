import { Stack } from 'expo-router';
import { TouchableOpacity, Alert, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import Navbar from './components/Navbar';

export default function RootLayout() {
  const pathname = usePathname();
  const hideNavbarPaths = ['/login', '/register'];
  const shouldShowNavbar = !hideNavbarPaths.includes(pathname);

  const handleProfilePress = () => {
    router.push('/Navigator');
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{
        headerShown: false,
        headerTitleAlign: 'center',
        headerStyle: {
          elevation: 5,
        },
        headerTitle: {
          fontSize: 18,
          fontWeight: '600',
          color: '#000000',
        },
        profileButton: {
          marginRight: 15,
          padding: 5,
        }
      }}>
        <Stack.Screen name="Login" options={{ headerShown: false }} />
        <Stack.Screen name="Register" options={{ headerTitle: 'Register', headerShown: false }} />
        <Stack.Screen 
          name="RestaurantList" 
          options={{ 
            headerShown: false,
            headerStyle: { paddingTop: 20 }
          }} 
        />
        <Stack.Screen name="Profile" options={{ headerTitle: <Text style={styles.headerTitle}>Profile</Text> }} />
        <Stack.Screen 
          name="RestaurantDetail" 
          options={{ 
            headerTitle: 'Restaurant Details',
            headerShown: false
          }} 
        />
          <Stack.Screen name="ReservationDetail" options={{ headerTitle: 'Reservation Details', headerShown: false }} />
        <Stack.Screen name="UserReservations" options={{ headerTitle: 'My Reservations' }} />
        <Stack.Screen 
          name="Navigator"
          options={{ 
            headerTitle: 'Menu',
            presentation: 'modal',
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="Support" 
          options={{ 
            headerTitle: 'Help & Support',
            presentation: 'card',
            headerStyle: styles.header,
            headerTitleStyle: styles.headerTitle,
          }} 
        />
        <Stack.Screen 
          name="Settings" 
          options={{ 
            headerTitle: 'Settings',
            presentation: 'card',
            headerStyle: styles.header,
            headerTitleStyle: styles.headerTitle,
          }} 
        />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
}); 