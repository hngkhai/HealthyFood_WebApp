import supabase from "../config/supabaseClient.js";

export default {
  async deletePostById(postId) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) {
        console.error("Supabase deletion error:", error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error deleting post:", error);
      throw new Error('Failed to delete post');
    }
  }
};
