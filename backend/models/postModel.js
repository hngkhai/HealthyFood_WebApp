import supabase from "../config/supabaseClient.js";

export default {
  async getPostById(postId) {
    try {
      const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) {
        console.error("Error fetching post data:", error);
        return null;
      }

      if (post.image) {
        const filePath = post.image.replace("https://fozznyfkxkrjkcppphpo.supabase.co/storage/v1/object/public/images/", "");
        const { data: signedUrlData, error: urlError } = await supabase
          .storage
          .from("images")
          .createSignedUrl(filePath, 60 * 60 * 24); // 24-hour expiration

        if (urlError) {
          console.error("Error generating signed URL:", urlError);
          post.imageUrl = post.image; // Fallback to the original URL if there's an error
        } else {
          post.imageUrl = signedUrlData.signedUrl;
        }
      }

      return post;
    } catch (error) {
      console.error("Error fetching post details:", error);
      throw new Error('Error fetching post details');
    }
  },
};