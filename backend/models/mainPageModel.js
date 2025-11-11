import supabase from "../config/supabaseClient.js";

// Function to fetch posts from the database
export const fetchPosts = async () => {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Error fetching posts: ' + error.message);
  }

  return posts;
};

// Function to upload image to Supabase storage
export const uploadImage = async (imageFile) => {
  try {
    const fileName = `${Date.now()}-${imageFile.originalname}`;
    const { data, error } = await supabase.storage
      .from("images")
      .upload(`posts/${fileName}`, imageFile.buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: imageFile.mimetype,
      });

    if (error) throw new Error("Error uploading image to Supabase: " + error.message);
    const imageUrl = supabase.storage.from("images").getPublicUrl(`posts/${fileName}`).data.publicUrl;
    return imageUrl;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Function to insert post data into database
export const createPost = async (postData) => {
  try {
    const { data, error } = await supabase.from("posts").insert([postData]);

    if (error) throw new Error("Error saving post to database: " + error.message);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
