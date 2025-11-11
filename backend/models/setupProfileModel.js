import supabase from "../config/supabaseClient.js";

// Function to upload profile picture
async function uploadProfileImage(imageFile) {
  const fileName = `${Date.now()}-${imageFile.originalname}`;
  
  const { error } = await supabase.storage
    .from("images")
    .upload(`profiles/${fileName}`, imageFile.buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: imageFile.mimetype,
    });

  if (error) {
    throw new Error('Error uploading image to Supabase: ' + error.message);
  }

  // Get the public URL of the uploaded image
  const imageUrl = supabase.storage.from("images").getPublicUrl(`profiles/${fileName}`).data.publicUrl;
  
  return imageUrl;
}

// Function to update the user's profile data
async function updateUserProfile(user_id, height, weight, targetWeight, birthday, imageUrl, age) {
  const { error } = await supabase
    .from('users')
    .update({ height, weight, birthday, target_weight: targetWeight, profile_picture: imageUrl, age })
    .eq('user_id', user_id);

  if (error) {
    throw new Error('Error updating profile: ' + error.message);
  }
  return true;
}

export default {
  uploadProfileImage,
  updateUserProfile,
};
