import adminModel from "../models/adminModel.js";

export default {
  // Controller for fetching flagged users
  getFlaggedUsers: async (req, res) => {
    try {
      const flaggedUsers = await adminModel.getFlaggedUsers();
      // Return JSON instead of rendering a view
      res.status(200).json({ flaggedUsers });
    } catch (err) {
      console.error('Error fetching flagged users:', err);
      res.status(500).json({ error: 'An error occurred. Please try again.' });
    }
  },

  // Controller for submitting a report
  submitReport: async (req, res) => {
    const { report_id, restriction_type, duration, description, username } = req.body;

    try {
      const reportData = { report_id, restriction_type, duration, description, username };
      const result = await adminModel.createReport(reportData);
      res.status(200).json({ result });
    } catch (err) {
      console.error('Error submitting report:', err);
      res.status(500).json({ error: 'An error occurred. Please try again.' });
    }
  },
};
