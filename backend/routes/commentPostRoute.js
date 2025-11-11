import express from 'express';
import commentPostController from '../controllers/commentPostController.js';

const router = express.Router();

const isAuthenticated = (req, res, next) => {
    if (req.session.user_id) {
      next();
    } else {
      res.redirect('/');
    }
  };

router.post('/post/:id/comment', isAuthenticated, commentPostController.addComment);

export default router;
