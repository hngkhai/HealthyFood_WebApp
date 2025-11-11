import supabase from "../config/supabaseClient.js";

export default {
  async getFlaggedUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .in('flag_reason', [
          'MISLEADING PICTURE',
          'HARMFUL CONTENT',
          'PORNOGRAPHIC REFERENCES',
          'HATE SPEECH AND DISCRIMINATION',
          'HARASSMENT',
          'MISINFORMATION'
        ])
        .not('flag_reason', 'is', null);

      if (error) {
        throw new Error('Error fetching flagged users: ' + error.message);
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  async createReport(reportData) {
    try {
      const { report_id, restriction_type, duration, description, username } = reportData;

      const { error } = await supabase
        .from('flags')
        .insert([
          {
            report_id,
            restriction_type,
            duration,
            description,
            username,
          },
        ]);

      if (error) {
        throw new Error('Error saving report: ' + error.message);
      }

      // After inserting the report, nullify the flag_reason in the users table
      const { updateError } = await supabase
        .from('users')
        .update({
          flag_reason: null,
          flag_description: null,
          flagged_post: null,
        })
        .eq('username', username);

      if (updateError) {
        throw new Error('Error updating user flag data: ' + updateError.message);
      }

      return { message: 'Report submitted successfully!' };
    } catch (error) {
      throw error;
    }
  },
};
