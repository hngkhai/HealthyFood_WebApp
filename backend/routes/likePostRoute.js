import express from 'express';
import likePostController from '../controllers/likePostController.js';

const router = express.Router();

const isAuthenticated = (req, res, next) => {
    if (req.session.user_id) {
      next();
    } else {
      res.redirect('/');
    }
  };

router.post('/post/:id/like', isAuthenticated, likePostController.likePost);

export default router;
