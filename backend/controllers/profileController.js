import { addMeal, getDailyMeals, getSavedPosts, getUserData, getUserPosts, getUserSavedPostIds, updateProfile, updateProfilePicture } from '../models/profileModel.js';

function calculateAge(birthday) {
  const birthDate = new Date(birthday);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // Check if the birthday hasn't occurred yet this year
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export const addMealController = async (req, res) => {
  const { foodTitle, foodIngredients, calories, mealType } = req.body;

  try {
    const data = await addMeal(req.session.user_id, foodTitle, foodIngredients, calories, mealType);
    return res.status(200).json({ message: 'Meal added successfully', data });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Error adding meal to database' });
  }
};

export const getMealsController = async (req, res) => {
  try {
    const dailyMeals = await getDailyMeals(req.session.user_id);
    const mealsWithParsedIngredients = dailyMeals.map(meal => ({
      ...meal,
      food_ingredients: meal.food_ingredients ? JSON.parse(meal.food_ingredients) : [],
    }));

    return res.json({ dailyMeals: mealsWithParsedIngredients });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Error fetching meals' });
  }
};

export const profileController = async (req, res) => {
  try {
    const user = await getUserData(req.session.user_id);
    const dailyMeals = await getDailyMeals(req.session.user_id);
    const posts = await getUserPosts(req.session.user_id);
    const savedPostIds = user.saved_post_id ? user.saved_post_id.map(Number) : [];
    const saved_posts = await getSavedPosts(savedPostIds);

    // Prepare daily meals and calculate calories
    const mealsWithParsedIngredients = dailyMeals.map(meal => ({
      ...meal,
      food_ingredients: meal.food_ingredients ? JSON.parse(meal.food_ingredients) : []
    }));

    const currentCalories = mealsWithParsedIngredients.reduce((sum, meal) => sum + meal.calories, 0);

    // Calculate target calories
    let targetCalories;
    if (user.targetWeight <= user.weight) {
      targetCalories = Math.round(88.362 + (13.397 * user.weight) + (4.799 * user.height) - (5.677 * 21));
    } else {
      targetCalories = Math.round(250 + 88.362 + (13.397 * user.weight) + (4.799 * user.height) - (5.677 * 21));
    }
    const percentage = Math.min((currentCalories / targetCalories) * 100, 100);

    // Render profile data
    const profileData = {
      username: user.username,
      birthday: user.birthday,
      age: user.age,
      height: user.height || 0,
      weight: user.weight || 0,
      targetWeight: user.target_weight || 0,
      postsCount: user.postsCount || 0,
      followersCount: user.followersCount || 0,
      followingCount: user.followingCount || 0,
      currentCalories,
      targetCalories,
      percentage,
      foodPosts: posts,
      savedFoodPosts: saved_posts,
      dailyMeals: mealsWithParsedIngredients,
      profile_picture: user.profile_picture,
      nutritionixApiKey: process.env.NUTRITIONIX_API_KEY,
      nutritionixAppId: process.env.NUTRITIONIX_APP_ID
    };

    
    res.json(profileData);
  } catch (error) {
    console.error("Error fetching profile data:", error);
    res.status(500).send("An error occurred while loading the profile page.");
  }
};

// Profile picture upload controller
export const updateProfilePicController = async (req, res) => {
  try {
    const imageFile = req.file;
    const user_id = req.session.user_id;

    if (!imageFile) {
      return res.status(400).send("No profile picture uploaded.");
    }

    // Call the service to handle profile picture update
    const imageUrl = await updateProfilePicture(user_id, imageFile);

    // Respond with success
    return res.status(201).json({ user_id, profile_picture: imageUrl });
  } catch (error) {
    console.error('Error uploading profile picture:', error.message);
    res.status(500).send('Error uploading profile picture: ' + error.message);
  }
};

export const updateProfileController = async (req, res) => {
  const { username, height, weight, targetWeight, birthday } = req.body;
  const birthDate = new Date(birthday);
  const updateData = {
    username,
    height,
    weight,
    target_weight: targetWeight,
    age: calculateAge(birthday),
    birthday: birthDate,
  };

  try {
    await updateProfile(req.session.user_id, updateData);
    res.status(200).send('Profile updated successfully.');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error updating profile');
  }
};

export async function getPostData(req, res) {
  const userId = req.session.user_id;

  try {
      // Fetch user's posts
      const { data: posts, error: postsError } = await getUserPosts(userId);
      if (postsError) {
          console.error("Error fetching posts:", postsError);
          return res.status(500).json({ message: "Error fetching user posts." });
      }

      // Fetch user's saved post IDs
      const { data: savedIdsData, error: savedIdsError } = await getUserSavedPostIds(userId);
      if (savedIdsError) {
          console.error("Error fetching saved post ids:", savedIdsError);
          return res.status(500).json({ message: "Error fetching saved post ids." });
      }

      const savedPostIds = savedIdsData?.saved_post_id ? savedIdsData.saved_post_id.map(Number) : [];

      // Fetch user's saved posts
      const { data: savedPosts, error: savedPostsError } = await getSavedPosts(savedPostIds);
      if (savedPostsError) {
          console.error("Error fetching saved posts:", savedPostsError);
          return res.status(500).json({ message: "Error fetching saved posts." });
      }

      // Return the user's posts and saved posts
      return res.status(200).json({
          foodPosts: posts,
          savedFoodPosts: savedPosts
      });
  } catch (error) {
      console.error("Unexpected error fetching post data:", error);
      return res.status(500).json({ message: "Unexpected error fetching post data." });
  }
}
