import supabase from "../config/supabaseClient.js";

export default {
  async getPostById(postId) {
    return await supabase
      .from('posts')
      .select('comments, user_id')
      .eq('id', postId)
      .single();
  },

  async updateComments(postId, comments) {
    return await supabase
      .from('posts')
      .update({ comments })
      .eq('id', postId);
  },

  async insertNotification(notificationData) {
    return await supabase
      .from('notifications')
      .insert([notificationData]);
  }
};
