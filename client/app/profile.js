// app/(tabs)/profile.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { supabase } from "../apis/supabaseClient";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from("users") // Replace with your actual table name
        .select(
          `
          id, email, name, weight, height, gender, 
          interest (id, name),
          fridge:fridge (
            id,
            items:fridge_item (id, name, quantity)
          )
          `
        )
        .eq("id", 6) // Fetch user with id 6 or dynamically use session
        .single();

      if (error) throw error;
      setUser(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load profile data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchUserData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Handle potentially missing profile data with safe defaults
  const userName = user?.name || "User";
  const userEmail = user?.email || "No email provided";
  const userHeight = user?.height || "--";
  const userWeight = user?.weight || "--";
  const userGender = user?.gender || "Not specified";
  const interests = user?.interests || [];
  const fridgeItems = user?.fridge?.items || [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Text style={styles.profileInitial}>{userName.charAt(0)}</Text>
          </View>
          <Text style={styles.profileName}>{userName}</Text>
          <Text style={styles.profileEmail}>{userEmail}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userHeight} cm</Text>
            <Text style={styles.statLabel}>Height</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userWeight} kg</Text>
            <Text style={styles.statLabel}>Weight</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userGender}</Text>
            <Text style={styles.statLabel}>Gender</Text>
          </View>
        </View>

        {/* Interests Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.interestTagsContainer}>
            {interests.length > 0 ? (
              interests.map((interest) => (
                <View key={interest.id} style={styles.interestTag}>
                  <Text style={styles.interestTagText}>{interest.name}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyStateText}>No interests added yet</Text>
            )}
          </View>
        </View>

        {/* Fridge Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>My Fridge</Text>
          <View style={styles.fridgeContainer}>
            {fridgeItems.length > 0 ? (
              fridgeItems.map((item) => (
                <View key={item.id} style={styles.fridgeItem}>
                  <View style={styles.fridgeItemIconContainer}>
                    <Ionicons
                      name="nutrition-outline"
                      size={20}
                      color="#4CAF50"
                    />
                  </View>
                  <Text style={styles.fridgeItemName}>{item.name}</Text>
                  <Text style={styles.fridgeItemQuantity}>
                    x{item.quantity}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyStateText}>Your fridge is empty</Text>
            )}
          </View>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  header: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 40,
    backgroundColor: "#F8FFF8",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  profileInitial: {
    fontSize: 42,
    fontWeight: "bold",
    color: "white",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: -15,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  verticalDivider: {
    height: 36,
    width: 1,
    backgroundColor: "#E0E0E0",
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  interestTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  interestTag: {
    backgroundColor: "#EEFFF0",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#D7F0DB",
  },
  interestTagText: {
    color: "#4CAF50",
    fontWeight: "500",
  },
  fridgeContainer: {
    backgroundColor: "#FBFBFB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  fridgeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  fridgeItemIconContainer: {
    width: 36,
    height: 36,
    backgroundColor: "#EEFFF0",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  fridgeItemName: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  fridgeItemQuantity: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  editButton: {
    backgroundColor: "#4CAF50",
    marginHorizontal: 20,
    marginVertical: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyStateText: {
    color: "#999",
    fontStyle: "italic",
    paddingVertical: 10,
  },
});
