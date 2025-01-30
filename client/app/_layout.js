import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "./socket";
import LoginScreen from "./index";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Layout() {
  const [reservations, setReservations] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Retrieve token from AsyncStorage when the app loads
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    // Connect to the server with the token when the component mounts
    if (token) {
      connectSocket(token);
    }

    // Cleanup on component unmount
    return () => {
      disconnectSocket();
    };
  }, [token]);

  return (
    <Stack>
      {/* Conditional rendering based on token */}
      {token ? (
        <>
          <Stack.Screen
            name="restaurants"
            options={{
              title: "Restaurants",
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="RestaurantDetail"
            options={{
              title: "Restaurant Details",
              headerShown: true,
            }}
          />
        </>
      ) : (
        <Stack.Screen
          name="index"
          options={{
            title: "Login",
            headerShown: false,
          }}
        />
      )}
      <Stack.Screen
        name="register"
        options={{
          title: "Register",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
