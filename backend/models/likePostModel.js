import supabase from "../config/supabaseClient.js";

export default {
  async getPostById(postId) {
    return await supabase
      .from('posts')
      .select('likes, liked_user_id, user_id')
      .eq('id', postId)
      .single();
  },

  async updateLikes(postId, updatedLikes, likedUsers) {
    return await supabase
      .from('posts')
      .update({ likes: updatedLikes, liked_user_id: likedUsers })
      .eq('id', postId);
  },

  async insertNotification(notificationData) {
    return await supabase
      .from('notifications')
      .insert([notificationData]);
  }
};
