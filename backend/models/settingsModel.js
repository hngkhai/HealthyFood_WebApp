import supabase from "../config/supabaseClient.js";

export default {
  async getUserById(user_id) {
    return await supabase.from('users').select('email, last_email_change, password_hash').eq('user_id', user_id).single();
  },
  
  async updateEmail(user_id, email) {
    return await supabase.from('users').update({ email }).eq('user_id', user_id);
  },

  async updateLastEmailChange(user_id, date) {
    return await supabase.from('users').update({ last_email_change: date }).eq('user_id', user_id);
  },

  async updatePassword(user_id, password_hash) {
    return await supabase.from('users').update({ password_hash }).eq('user_id', user_id);
  },

  async deleteUser(user_id) {
    return await supabase.from('users').delete().eq('user_id', user_id);
  },
  
  async deleteOldMeals() {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // 24 hours ago
      const { error } = await supabase
        .from('dailymeals')
        .delete()
        .lt('created_at', oneDayAgo); // Deletes entries older than 24 hours

      if (error) {
        throw new Error("Error deleting old meals: " + error.message);
      } else {
        console.log("Old meals deleted successfully");
      }
    } catch (error) {
      console.error("Unexpected error during meal deletion:", error);
    }
  }
};
