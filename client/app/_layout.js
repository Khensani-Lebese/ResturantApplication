import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Login",
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          title: "Register",
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="restaurants" 
        options={{ 
          title: "Restaurants",
          headerBackVisible: false 
        }} 
      />
      <Stack.Screen 
        name="RestaurantDetail" 
        options={{ 
          title: "Restaurant Details",
          headerShown: true 
        }} 
      />
    </Stack>
  );
} 