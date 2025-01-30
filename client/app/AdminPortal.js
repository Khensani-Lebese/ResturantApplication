import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";

export default function AdminPortal() {
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    location: "",
    cuisine: "",
    ownerId: "",
    description: "",
    contact: "",
    reservationSlots: [],
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          "https://restaurant-server-5htc.onrender.com/api/restaurants"
        );
        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };
    fetchRestaurants();
  }, []);

  const handleAddRestaurant = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Make sure the token is retrieved correctly

      if (!token) {
        Alert.alert("Error", "You must be logged in to add a restaurant.");
        return;
      }

      const response = await axios.post(
        " http://localhost:5000/api/restaurants",
        newRestaurant,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      setRestaurants([...restaurants, response.data.restaurant]);
      Alert.alert("Success", "Restaurant added successfully!");
      setNewRestaurant({
        name: "",
        location: "",
        cuisine: "",
        ownerId: "",
        description: "",
        contact: "",
        reservationSlots: [],
      });
    } catch (error) {
      console.error("Error adding restaurant:", error);
      Alert.alert("Error", "Failed to add the restaurant.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Portal</Text>

      <Text style={styles.sectionTitle}>Add New Restaurant</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={newRestaurant.name}
        onChangeText={(text) =>
          setNewRestaurant({ ...newRestaurant, name: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={newRestaurant.location}
        onChangeText={(text) =>
          setNewRestaurant({ ...newRestaurant, location: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Cuisine"
        value={newRestaurant.cuisine}
        onChangeText={(text) =>
          setNewRestaurant({ ...newRestaurant, cuisine: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Owner ID"
        value={newRestaurant.ownerId}
        onChangeText={(text) =>
          setNewRestaurant({ ...newRestaurant, ownerId: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={newRestaurant.description}
        onChangeText={(text) =>
          setNewRestaurant({ ...newRestaurant, description: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Contact"
        value={newRestaurant.contact}
        onChangeText={(text) =>
          setNewRestaurant({ ...newRestaurant, contact: text })
        }
      />
      <TouchableOpacity style={styles.button} onPress={handleAddRestaurant}>
        <Text style={styles.buttonText}>Add Restaurant</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Restaurants List</Text>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.restaurantCard}>
            <Text style={styles.restaurantName}>{item.name}</Text>
            <Text>{item.location}</Text>
            <Text>{item.cuisine}</Text>
            <TouchableOpacity
              onPress={() => Alert.alert("Edit functionality coming soon!")}
            >
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  restaurantCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  editButton: {
    color: "blue",
    marginTop: 5,
  },
});
