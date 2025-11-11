import express from 'express';
import multer from "multer";
import { addMealController, getMealsController, getPostData, profileController, updateProfileController, updateProfilePicController } from '../controllers/profileController.js';

// Multer setup for handling file upload
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

const isAuthenticated = (req, res, next) => {
    if (req.session.user_id) {
      next();
    } else {
      res.redirect('/');
    }
  };

  router.post('/addMeal', isAuthenticated, addMealController);
  router.get('/getMeals', isAuthenticated, getMealsController);
  router.get('/profile', isAuthenticated, profileController);
  router.post("/update-profile-pic", isAuthenticated, upload.single('profilePicUpload'), updateProfilePicController);
  router.post('/updateProfile', isAuthenticated, updateProfileController);
  router.get('/post-data', isAuthenticated, getPostData);
  
  export default router;
