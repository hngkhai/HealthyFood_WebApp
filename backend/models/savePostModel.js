import supabase from "../config/supabaseClient.js";

// Function to get saved posts for a user
export async function getUserSavedPosts(userId) {
    const { data: user, error } = await supabase
        .from('users')
        .select('saved_post_id')
        .eq('user_id', userId)
        .single();
    return { user, error };
}

// Function to update saved posts for a user
export async function updateUserSavedPosts(userId, updatedSavedPostsId) {
    const { error } = await supabase
        .from('users')
        .update({ saved_post_id: updatedSavedPostsId })
        .eq('user_id', userId);
    return error;
}

// Function to fetch all posts
export async function fetchPosts() {
    const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
    return { posts, error };
}

// Function to generate signed URL for a post image
export async function generateSignedUrl(imagePath) {
    const { data: signedUrlData, error } = await supabase
        .storage
        .from('images') // Ensure 'images' matches your actual bucket name
        .createSignedUrl(imagePath, 60 * 60 * 24); // Expires in 24 hours
    return { signedUrlData, error };
}
