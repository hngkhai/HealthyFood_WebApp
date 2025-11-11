import supabase from "../config/supabaseClient.js";

export default {
  async getUserById(userId) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
        return null;
      }

      return user;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw new Error('Error fetching user data');
    }
  },

  async getUserBySessionId(sessionUserId) {
    return await this.getUserById(sessionUserId);
  },
};