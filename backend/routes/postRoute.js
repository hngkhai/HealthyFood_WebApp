import express from 'express';
import postController from '../controllers/postController.js';

const router = express.Router();

const isAuthenticated = (req, res, next) => {
    if (req.session.user_id) {
      next();
    } else {
      res.redirect('/');
    }
  };

// Define route for individual post details
router.get('/post/:id', isAuthenticated, postController.getPostDetails);

export default router;
