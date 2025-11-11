import express from 'express';
import multer from "multer";
import { addPost, getMainPage } from '../controllers/mainPageController.js';
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


router.get('/api/main', isAuthenticated, getMainPage);
router.post('/api/addPost', isAuthenticated, upload.single('recipeImage'), addPost);

export default router;
