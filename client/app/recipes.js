// app/(tabs)/recipes.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function RecipeAIScreen() {
  const colorScheme = useColorScheme();
  const [preferences, setPreferences] = useState("");
  const [generating, setGenerating] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [popularIngredients, setPopularIngredients] = useState([
    { id: 1, name: "Chicken", selected: false },
    { id: 2, name: "Pasta", selected: false },
    { id: 3, name: "Rice", selected: false },
    { id: 4, name: "Potatoes", selected: false },
    { id: 5, name: "Tomatoes", selected: false },
    { id: 6, name: "Avocado", selected: false },
    { id: 7, name: "Beef", selected: false },
    { id: 8, name: "Eggs", selected: false },
    { id: 9, name: "Spinach", selected: false },
  ]);

  const toggleIngredient = (id) => {
    setPopularIngredients(
      popularIngredients.map((ingredient) =>
        ingredient.id === id
          ? { ...ingredient, selected: !ingredient.selected }
          : ingredient
      )
    );
  };

  const generateRecipes = () => {
    setGenerating(true);

    // Combine selected ingredients and text preferences
    const selectedIngredients = popularIngredients
      .filter((i) => i.selected)
      .map((i) => i.name);

    let preferencesText = preferences.trim();
    if (selectedIngredients.length > 0) {
      if (preferencesText) {
        preferencesText += ` with ${selectedIngredients.join(", ")}`;
      } else {
        preferencesText = `Recipes with ${selectedIngredients.join(", ")}`;
      }
    }

    // Mock API call to AI recipe generator
    setTimeout(() => {
      // Mock response with generated recipes
      const mockRecipes = [
        {
          id: 1,
          title: "Garlic Butter Chicken",
          prepTime: "25 mins",
          calories: 420,
          image: "chicken",
          ingredients: [
            "2 chicken breasts",
            "3 cloves garlic, minced",
            "2 tbsp butter",
            "1 tbsp olive oil",
            "1 tsp dried herbs",
            "Salt and pepper to taste",
          ],
          steps: [
            "Season chicken with salt, pepper and dried herbs.",
            "Heat oil in a pan over medium-high heat.",
            "Add chicken and cook for 5-7 minutes per side until golden and cooked through.",
            "Remove chicken and set aside.",
            "In the same pan, add butter and garlic, cook for 1 minute until fragrant.",
            "Return chicken to the pan, spoon the sauce over it and serve.",
          ],
        },
        {
          id: 2,
          title: "Mediterranean Pasta Salad",
          prepTime: "20 mins",
          calories: 380,
          image: "pasta",
          ingredients: [
            "2 cups pasta, cooked al dente",
            "1 cup cherry tomatoes, halved",
            "1/2 cup cucumber, diced",
            "1/4 cup red onion, thinly sliced",
            "1/4 cup black olives, sliced",
            "1/4 cup feta cheese, crumbled",
            "2 tbsp olive oil",
            "1 tbsp lemon juice",
            "1 tsp dried oregano",
            "Salt and pepper to taste",
          ],
          steps: [
            "In a large bowl, combine pasta, tomatoes, cucumber, red onion, olives, and feta cheese.",
            "In a small bowl, whisk together olive oil, lemon juice, oregano, salt, and pepper.",
            "Pour the dressing over the salad and toss gently to combine.",
            "Chill for at least 30 minutes before serving.",
          ],
        },
        {
          id: 3,
          title: "Vegetable Fried Rice",
          prepTime: "15 mins",
          calories: 320,
          image: "rice",
          ingredients: [
            "2 cups cooked rice, cold",
            "1/2 cup mixed vegetables (peas, carrots, corn)",
            "2 eggs, beaten",
            "2 tbsp soy sauce",
            "1 tbsp sesame oil",
            "2 green onions, sliced",
            "1 clove garlic, minced",
            "1 tsp ginger, grated",
          ],
          steps: [
            "Heat oil in a large wok or pan over high heat.",
            "Add garlic and ginger, stir-fry for 30 seconds.",
            "Add vegetables and stir-fry for 2 minutes.",
            "Push everything to one side of the pan, pour beaten eggs on the other side.",
            "Scramble the eggs, then mix with the vegetables.",
            "Add cold rice, breaking up any clumps.",
            "Add soy sauce and stir well to combine.",
            "Stir in green onions and serve hot.",
          ],
        },
      ];

      setRecipes(mockRecipes);
      setGenerating(false);
    }, 2000);
  };

  const viewRecipeDetails = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const closeRecipeDetails = () => {
    setSelectedRecipe(null);
  };

  const getImageForRecipe = (imageName) => {
    // Mock function to return image based on keyword
    // In a real app, you would have actual images or use a food image API
    switch (imageName) {
      case "chicken":
        return {
          uri: "https://via.placeholder.com/300/EEFFF0/4CAF50?text=Chicken+Dish",
        };
      case "pasta":
        return {
          uri: "https://via.placeholder.com/300/EEFFF0/4CAF50?text=Pasta+Dish",
        };
      case "rice":
        return {
          uri: "https://via.placeholder.com/300/EEFFF0/4CAF50?text=Rice+Dish",
        };
      default:
        return {
          uri: "https://via.placeholder.com/300/EEFFF0/4CAF50?text=Food+Dish",
        };
    }
  };

  const renderRecipeCard = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => viewRecipeDetails(item)}
    >
      <Image
        source={getImageForRecipe(item.image)}
        style={styles.recipeCardImage}
      />
      <View style={styles.recipeCardContent}>
        <Text style={styles.recipeCardTitle}>{item.title}</Text>
        <View style={styles.recipeCardInfo}>
          <View style={styles.recipeCardInfoItem}>
            <Ionicons name="time-outline" size={14} color="#4CAF50" />
            <Text style={styles.recipeCardInfoText}>{item.prepTime}</Text>
          </View>
          <View style={styles.recipeCardInfoItem}>
            <Ionicons name="flame-outline" size={14} color="#4CAF50" />
            <Text style={styles.recipeCardInfoText}>{item.calories} cal</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recipe AI</Text>
        <Text style={styles.headerSubtitle}>
          Let AI create personalized recipes
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>What would you like to cook?</Text>
          <TextInput
            style={styles.textInput}
            placeholder="E.g., quick dinner, vegetarian meal, low-carb..."
            value={preferences}
            onChangeText={setPreferences}
            multiline
          />
        </View>

        <View style={styles.ingredientsContainer}>
          <Text style={styles.ingredientsTitle}>Popular Ingredients</Text>
          <View style={styles.ingredientTags}>
            {popularIngredients.map((ingredient) => (
              <TouchableOpacity
                key={ingredient.id}
                style={[
                  styles.ingredientTag,
                  ingredient.selected && styles.ingredientTagSelected,
                ]}
                onPress={() => toggleIngredient(ingredient.id)}
              >
                <Text
                  style={[
                    styles.ingredientTagText,
                    ingredient.selected && styles.ingredientTagTextSelected,
                  ]}
                >
                  {ingredient.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.generateButton}
          onPress={generateRecipes}
          disabled={generating}
        >
          {generating ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Ionicons
                name="restaurant-outline"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.generateButtonText}>Generate Recipes</Text>
            </>
          )}
        </TouchableOpacity>

        {recipes.length > 0 && !generating && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Your Recipes</Text>
            <FlatList
              data={recipes}
              renderItem={renderRecipeCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recipeList}
              snapToAlignment="start"
              decelerationRate="fast"
              snapToInterval={270} // card width + padding
            />
          </View>
        )}
      </ScrollView>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <View style={styles.recipeDetailOverlay}>
          <View style={styles.recipeDetailContainer}>
            <ScrollView style={styles.recipeDetailScroll}>
              <TouchableOpacity
                style={styles.recipeDetailCloseButton}
                onPress={closeRecipeDetails}
              >
                <Ionicons name="close-outline" size={24} color="#333" />
              </TouchableOpacity>

              <Image
                source={getImageForRecipe(selectedRecipe.image)}
                style={styles.recipeDetailImage}
              />

              <View style={styles.recipeDetailContent}>
                <Text style={styles.recipeDetailTitle}>
                  {selectedRecipe.title}
                </Text>

                <View style={styles.recipeDetailInfoRow}>
                  <View style={styles.recipeDetailInfoItem}>
                    <Ionicons name="time-outline" size={16} color="#4CAF50" />
                    <Text style={styles.recipeDetailInfoText}>
                      {selectedRecipe.prepTime}
                    </Text>
                  </View>
                  <View style={styles.recipeDetailInfoItem}>
                    <Ionicons name="flame-outline" size={16} color="#4CAF50" />
                    <Text style={styles.recipeDetailInfoText}>
                      {selectedRecipe.calories} cal
                    </Text>
                  </View>
                </View>

                <View style={styles.recipeDetailSection}>
                  <Text style={styles.recipeDetailSectionTitle}>
                    Ingredients
                  </Text>
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <View key={index} style={styles.ingredientItem}>
                      <View style={styles.ingredientBullet} />
                      <Text style={styles.ingredientText}>{ingredient}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.recipeDetailSection}>
                  <Text style={styles.recipeDetailSectionTitle}>
                    Instructions
                  </Text>
                  {selectedRecipe.steps.map((step, index) => (
                    <View key={index} style={styles.stepItem}>
                      <Text style={styles.stepNumber}>{index + 1}</Text>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingTop: 10,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: "#F8FFF8",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
    minHeight: 80,
  },
  ingredientsContainer: {
    marginBottom: 20,
  },
  ingredientsTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 12,
  },
  ingredientTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  ingredientTag: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  ingredientTagSelected: {
    backgroundColor: "#EEFFF0",
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  ingredientTagText: {
    color: "#666",
  },
  ingredientTagTextSelected: {
    color: "#4CAF50",
    fontWeight: "500",
  },
  generateButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  generateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultsContainer: {
    marginTop: 8,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  recipeList: {
    paddingRight: 20,
  },
  recipeCard: {
    width: 250,
    marginRight: 20,
    borderRadius: 16,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  recipeCardImage: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  recipeCardContent: {
    padding: 16,
  },
  recipeCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  recipeCardInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  recipeCardInfoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  recipeCardInfoText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  recipeDetailOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  recipeDetailContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "90%",
  },
  recipeDetailScroll: {
    flex: 1,
  },
  recipeDetailCloseButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  recipeDetailImage: {
    width: "100%",
    height: 240,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  recipeDetailContent: {
    padding: 20,
  },
  recipeDetailTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  recipeDetailInfoRow: {
    flexDirection: "row",
    marginBottom: 24,
  },
  recipeDetailInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  recipeDetailInfoText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
  recipeDetailSection: {
    marginBottom: 24,
  },
  recipeDetailSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4CAF50",
    marginRight: 10,
  },
  ingredientText: {
    fontSize: 15,
    color: "#333",
  },
  stepItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4CAF50",
    color: "white",
    textAlign: "center",
    lineHeight: 24,
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 12,
  },
  stepText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
    lineHeight: 22,
  },
});
