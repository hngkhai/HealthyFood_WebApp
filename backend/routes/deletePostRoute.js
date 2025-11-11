import express from 'express';
import deletePostController from '../controllers/deletePostController.js';

const router = express.Router();

router.delete('/post/:id/delete', deletePostController.deletePost);

export default router;
