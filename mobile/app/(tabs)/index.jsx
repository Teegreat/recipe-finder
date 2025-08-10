import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { MealAPI } from "../../services/mealAPI";
import { homeStyles } from "../../assets/styles/home.styles";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

const HomeScreen = () => {
  const router = useRouter();
  const [setselectedCategory, setSetselectedCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredRecipe, setFeaturedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const [apiCategories, randomMeals, featuredMeals] = await Promise.all([
        MealAPI.getCategories(),
        MealAPI.getRandomMeals(12),
        MealAPI.getRandomMeal(),
      ]);

      const transformedCategories = apiCategories.map((cat, index) => ({
        id: index + 1,
        name: cat.strCategory,
        image: cat.strCategoryThumb,
        description: cat.strCategoryDescription,
      }));

      setCategories(transformedCategories);

      const transformedMeals = randomMeals
        .map((meal) => MealAPI.transformMealData(meal))
        .filter((meal) => meal !== null);
      setRecipes(transformedMeals);

      const transformedFeatured = MealAPI.transformMealData(featuredMeals);
      // console.log(transformedFeatured);
      setFeaturedRecipe(transformedFeatured);
    } catch (error) {
      console.log("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryData = async (category) => {
    try {
      const meals = await MealAPI.filterByCategory(category);
      const transformedMeals = meals
        .map((meal) => MealAPI.transformMealData(meal))
        .filter((meal) => meal !== null);
      setRecipes(transformedMeals);
    } catch (error) {
      console.error("Error loading category data:", error);
      setRecipes([]);
    }
  };

  const handleCategorySelect = async (category) => {
    setSetselectedCategory(category);
    await loadCategoryData(category);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={homeStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        // refreshControl={() => {}}
        contentContainerStyle={homeStyles.scrollContent}
      >
        <View style={homeStyles.welcomeSection}>
          <Image
            source={require("../../assets/images/lamb.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />

          <Image
            source={require("../../assets/images/chicken.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />

          <Image
            source={require("../../assets/images/pork.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />
        </View>

        <View style={homeStyles.featuredSection}>
          {featuredRecipe && (
            <View style={homeStyles.featuredSection}>
              <TouchableOpacity
                onPress={() => router.push(`/recipe/${featuredRecipe.id}`)}
                style={homeStyles.featuredCard}
                activeOpacity={0.9}
              >
                <View style={homeStyles.featuredImageContainer}>
                  <Image
                    source={{ uri: featuredRecipe.image }}
                    style={homeStyles.featuredImage}
                    contentFit="cover"
                    transition={500}
                  />
                  <View style={homeStyles.featuredOverlay}>
                    <View style={homeStyles.featuredBadge}>
                      <Text style={homeStyles.featuredBadgeText}>Featured</Text>
                    </View>
                    <View style={homeStyles.featuredContent}>
                      <Text style={homeStyles.featuredTitle} numberOfLines={2}>
                        {featuredRecipe.title}
                      </Text>

                      <View style={homeStyles.featuredMeta}>
                        <View style={homeStyles.metaItem}>
                          <Ionicons
                            name="time-outline"
                            size={16}
                            color={COLORS.white}
                          />
                          <Text style={homeStyles.metaText}>
                            {featuredRecipe.cookTime}
                          </Text>
                        </View>
                        <View style={homeStyles.metaItem}>
                          <Ionicons
                            name="people-outline"
                            size={16}
                            color={COLORS.white}
                          />
                          <Text style={homeStyles.metaText}>
                            {featuredRecipe.servings}
                          </Text>
                        </View>

                        {featuredRecipe.area && (
                          <View style={homeStyles.metaItem}>
                            <Ionicons
                              name="location-outline"
                              size={16}
                              color={COLORS.white}
                            />
                            <Text style={homeStyles.metaText}>
                              {featuredRecipe.area}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
