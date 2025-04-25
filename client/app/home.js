// app/(tabs)/home.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [userFirstName, setUserFirstName] = useState("Alex");
  const [fridgeItems, setFridgeItems] = useState([
    { id: 1, name: "Broccoli", quantity: 2, expiresIn: 3 },
    { id: 2, name: "Chicken", quantity: 1, expiresIn: 2 },
    { id: 3, name: "Yogurt", quantity: 3, expiresIn: 5 },
    { id: 4, name: "Tomatoes", quantity: 4, expiresIn: 4 },
  ]);

  const [quickRecipes, setQuickRecipes] = useState([
    {
      id: 1,
      title: "Chicken Stir Fry",
      time: "20 min",
      image: "https://via.placeholder.com/150/EEFFF0/4CAF50?text=Chicken",
    },
    {
      id: 2,
      title: "Veggie Pasta",
      time: "15 min",
      image: "https://via.placeholder.com/150/EEFFF0/4CAF50?text=Pasta",
    },
    {
      id: 3,
      title: "Fruit Smoothie",
      time: "5 min",
      image: "https://via.placeholder.com/150/EEFFF0/4CAF50?text=Smoothie",
    },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hey, {userFirstName}!</Text>
            <Text style={styles.subtitle}>
              What would you like to cook today?
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Quick Action Buttons */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push("/scanner")}
          >
            <View style={styles.quickActionIconContainer}>
              <Ionicons name="scan-outline" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.quickActionText}>Scan Food</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push("/recipes")}
          >
            <View style={styles.quickActionIconContainer}>
              <Ionicons name="restaurant-outline" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.quickActionText}>Get Recipes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push("/profile")}
          >
            <View style={styles.quickActionIconContainer}>
              <Ionicons name="person-outline" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.quickActionText}>Profile</Text>
          </TouchableOpacity>
        </View>

        {/* My Fridge Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Fridge</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fridgeItemsContainer}>
            {fridgeItems.map((item) => (
              <View key={item.id} style={styles.fridgeItem}>
                <View style={styles.fridgeItemIconContainer}>
                  <Ionicons
                    name="nutrition-outline"
                    size={20}
                    color="#4CAF50"
                  />
                </View>
                <View style={styles.fridgeItemContent}>
                  <Text style={styles.fridgeItemName}>{item.name}</Text>
                  <View style={styles.fridgeItemDetails}>
                    <Text style={styles.fridgeItemQuantity}>
                      Qty: {item.quantity}
                    </Text>
                    <Text
                      style={[
                        styles.fridgeItemExpiry,
                        item.expiresIn <= 2 && styles.expiryWarning,
                      ]}
                    >
                      Expires in {item.expiresIn} days
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Recipes Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Recipes</Text>
            <TouchableOpacity onPress={() => router.push("/recipes")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recipesScrollContainer}
          >
            {quickRecipes.map((recipe) => (
              <TouchableOpacity key={recipe.id} style={styles.recipeCard}>
                <Image
                  source={{ uri: recipe.image }}
                  style={styles.recipeImage}
                />
                <View style={styles.recipeCardContent}>
                  <Text style={styles.recipeTitle}>{recipe.title}</Text>
                  <View style={styles.recipeTimeContainer}>
                    <Ionicons name="time-outline" size={14} color="#4CAF50" />
                    <Text style={styles.recipeTime}>{recipe.time}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tip of the Day */}
        <View style={styles.tipContainer}>
          <View style={styles.tipIconContainer}>
            <Ionicons name="bulb-outline" size={24} color="#4CAF50" />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Tip of the Day</Text>
            <Text style={styles.tipText}>
              Store leafy greens with a paper towel in the container to absorb
              excess moisture and keep them fresh longer.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickActionButton: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#F8FFF8",
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  quickActionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#EEFFF0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  sectionContainer: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  fridgeItemsContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    padding: 16,
  },
  fridgeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  fridgeItemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEFFF0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  fridgeItemContent: {
    flex: 1,
  },
  fridgeItemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  fridgeItemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fridgeItemQuantity: {
    fontSize: 14,
    color: "#666",
  },
  fridgeItemExpiry: {
    fontSize: 14,
    color: "#666",
  },
  expiryWarning: {
    color: "#FF6B6B",
  },
  recipesScrollContainer: {
    paddingRight: 20,
  },
  recipeCard: {
    width: 160,
    borderRadius: 16,
    backgroundColor: "white",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    overflow: "hidden",
  },
  recipeImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  recipeCardContent: {
    padding: 12,
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  recipeTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  recipeTime: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  tipContainer: {
    flexDirection: "row",
    backgroundColor: "#EEFFF0",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});
