import { createPost, fetchPosts, uploadImage } from '../models/mainPageModel.js';

// Get posts and render the main page
export const getMainPage = async (req, res) => {
  try {
    const posts = await fetchPosts();

    // Access the Nutritionix API credentials from environment variables
    const nutritionixApiKey = process.env.NUTRITIONIX_API_KEY;
    const nutritionixAppId = process.env.NUTRITIONIX_APP_ID;

    res.json({
      posts,
      nutritionixApiKey,
      nutritionixAppId
    });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('An error occurred. Please try again.');
  }
};

// Add a new post
export const addPost = async (req, res) => {
  const { title, description, category } = req.body;
  let ingredients = req.body.ingredients;
  const quantity = req.body.quantity;
  const user_id = req.session.user_id;
  const imageFile = req.file;
  const calories = req.body.calories;

  try {
    let imageUrl = null;

    // If image is provided, upload it to Supabase storage
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    // Prepare post data to insert into database
    const postData = {
      user_id,
      title,
      description,
      category,
      ingredients,
      image: imageUrl,
      calories,
    };

    // Insert post data into the database
    const post = await createPost(postData);

    // Respond with success
    return res.status(201).json({ user_id });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("An error occurred. Please try again.");
  }
};
