import supabase from "../config/supabaseClient.js";

export const addMeal = async (userId, foodTitle, foodIngredients, calories, mealType) => {
  const { data, error } = await supabase
    .from('dailymeals')
    .insert([
      {
        user_id: userId,
        food_title: foodTitle,
        food_ingredients: foodIngredients,
        calories,
        meal_type: mealType
      }
    ]);

  if (error) {
    throw new Error('Error adding meal to database');
  }

  return data;
};

export const getDailyMeals = async (userId) => {
  const { data, error } = await supabase
    .from('dailymeals')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw new Error('Error fetching daily meals');
  }

  return data;
};

export const getUserData = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    throw new Error('Error fetching user data');
  }

  return data;
};

// Service to handle profile picture upload and updating user data
export const updateProfilePicture = async (user_id, imageFile) => {
  try {
    let imageUrl = null;

    if (imageFile) {
      // Upload to Supabase storage
      const fileName = `${Date.now()}-${imageFile.originalname}`;
      const { data, error } = await supabase.storage
        .from("images")
        .upload(`profiles/${fileName}`, imageFile.buffer, {
          cacheControl: '3600',
          upsert: true,
          contentType: imageFile.mimetype,
        });

      if (error) {
        throw new Error("Error uploading image to Supabase: " + error.message);
      }

      // Get public URL of the uploaded image
      imageUrl = supabase.storage.from("images").getPublicUrl(`profiles/${fileName}`).data.publicUrl;

      // Retrieve old image id from the users table
      const { data: old, error: oldErr } = await supabase
        .from("users")
        .select("profile_picture")
        .eq("user_id", user_id)
        .single();

      if (oldErr) {
        throw new Error("Error retrieving old image from Supabase: " + oldErr.message);
      }

      // Delete old image from storage
      const { data: remove, error: removeError } = await supabase.storage
        .from("images")
        .remove(old.profile_picture);

      if (removeError) {
        throw new Error("Error removing old image: " + removeError.message);
      }

      // Update user's profile picture URL in the database
      const { error: updateError } = await supabase
        .from("users")
        .update({ profile_picture: imageUrl })
        .eq("user_id", user_id);

      if (updateError) {
        throw new Error("Error updating profile picture in database: " + updateError.message);
      }

      return imageUrl;
    } else {
      throw new Error("No profile picture uploaded.");
    }
  } catch (error) {
    throw new Error("Error in profile picture service: " + error.message);
  }
};

export const updateProfile = async (userId, updateData) => {
  const { error } = await supabase
    .from('users')
    .update(updateData)
    .eq('user_id', userId);

  if (error) {
    throw new Error('Error updating profile');
  }

  return { message: 'Profile updated successfully' };
};

export async function getUserPosts(userId) {
  const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  return { data, error };
}

export async function getUserSavedPostIds(userId) {
  const { data, error } = await supabase
      .from('users')
      .select('saved_post_id')
      .eq('user_id', userId)
      .single();
  return { data, error };
}

export async function getSavedPosts(savedPostIds) {
  const { data, error } = await supabase
      .from('posts')
      .select('*')
      .in("id", savedPostIds);
  return { data, error };
}
