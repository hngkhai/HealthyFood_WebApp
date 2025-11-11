import express from 'express';
import multer from "multer";
import setupProfileController from '../controllers/setupProfileController.js';
const router = express.Router();

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

const isAuthenticated = (req, res, next) => {
    if (req.session.user_id) {
      next();
    } else {
      res.redirect('/');
    }
  };

// Route for displaying the setup profile page
router.get('/setup-profile/:user_id', isAuthenticated, setupProfileController.getSetupProfilePage);

// Route for updating the user profile
router.put('/setup-profile/:user_id', isAuthenticated, upload.single('pictureFile'), setupProfileController.updateProfile);

export default router;
