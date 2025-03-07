import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        router.replace('/RestaurantList');
      } else {
        router.replace('/Login');
      }
    };

    checkLoginStatus();
  }, []);

  return null;
}