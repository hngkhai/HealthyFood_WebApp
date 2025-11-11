import bcrypt from 'bcrypt';
import settingsModel from '../models/settingsModel.js';

export default {
  async getSettingsPage(req, res) {
    const user_id = req.session.user_id;
    if (!user_id) return res.redirect('/');

    const { data: user, error } = await settingsModel.getUserById(user_id);
    if (error || !user) return res.status(500).send("User data not found.");

    res.json({ 
        email: user.email,
        nutritionixApiKey: process.env.NUTRITIONIX_API_KEY, // Pass the API key
        nutritionixAppId: process.env.NUTRITIONIX_APP_ID  // Pass the App ID
    });
  },

  async updateEmail(req, res) {
    const { currentPassword, email } = req.body;
    const user_id = req.session.user_id;
    if (!user_id) return res.redirect('/');

    const { data: user, error } = await settingsModel.getUserById(user_id);
    if (error || !user) return res.status(500).send("User data not found.");

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isPasswordValid) return res.status(401).json({ error: "Incorrect current password." });
    if (user.email === email) return res.status(401).json({ error: "New email cannot be the same as the current email." });

    const lastEmailChange = user.last_email_change ? new Date(user.last_email_change) : null;
    const timeDifference = Date.now() - lastEmailChange;
    if (lastEmailChange && timeDifference < 30 * 24 * 60 * 60 * 1000) {
      const remainingTime = 30 * 24 * 60 * 60 * 1000 - timeDifference;
      const formattedTime = `${Math.floor(remainingTime / 86400000)} days`;
      return res.status(403).json({ error: "You can only change your email once every month. Remaining time: " + formattedTime });
    }

    await settingsModel.updateEmail(user_id, email);
    await settingsModel.updateLastEmailChange(user_id, new Date());
    res.status(200).json({ message: "Email updated successfully" });
  },

  async updatePassword(req, res) {
    const { currentPassword, newPassword } = req.body;
    const user_id = req.session.user_id;
    if (!user_id) return res.redirect('/');

    const { data: user, error } = await settingsModel.getUserById(user_id);
    if (error || !user) return res.status(500).send("User data not found.");

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isPasswordValid) return res.status(401).json({ error: "Incorrect current password." });

    const isSameAsCurrentPassword = await bcrypt.compare(newPassword, user.password_hash);
    if (isSameAsCurrentPassword) return res.status(400).json({ error: "New password cannot be the same as the current password." });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await settingsModel.updatePassword(user_id, hashedPassword);
    res.status(200).json({ message: "Password updated successfully" });
  },

  async deleteAccount(req, res) {
    const user_id = req.session.user_id;
    await settingsModel.deleteUser(user_id);
    req.session.destroy((err) => {
      if (err) return res.status(500).send("Error deleting account.");
      res.status(200).json({ message: "Account deleted successfully" });
    });
  },

  // Delete old meals from the 'dailymeals' table
  deleteOldMeals: async () => {
    try {
      const deleteOldMeals = async () => {
        try {
          await mealModel.deleteOldMeals();
        } catch (error) {
          console.error("Error in controller during deletion:", error);
        }
      };

      // Schedule the deletion to run every 10 minutes
      setInterval(deleteOldMeals, 10 * 60 * 1000); //(Change to 24 * 60 * 60 * 1000 for production)
      
      // Call the function initially to immediate execute
      deleteOldMeals();
      
    } catch (error) {
      console.error("Error in scheduling meal deletion:", error);
    }
  }
};
