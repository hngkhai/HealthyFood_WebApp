import express from "express";
import adminController from "../controllers/adminController.js";

const router = express.Router();

const isAuthenticated = (req, res, next) => {
  if (req.session.user_id) return next();
  res.status(401).json({ error: "Not authenticated" });
};

// API routes
router.get('/admin/flaggedUsers', isAuthenticated, adminController.getFlaggedUsers);
router.post('/admin/submitReport', isAuthenticated, adminController.submitReport);

export default router;
