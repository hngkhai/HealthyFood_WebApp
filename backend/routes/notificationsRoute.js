import express from 'express';
import fetchNotifications, { clearNotifications, fetchLatestNotifications, markAsRead } from '../controllers/notificationsController.js';

const router = express.Router();

const isAuthenticated = (req, res, next) => {
  if (req.session.user_id) {
    next();
  } else {
    res.redirect('/');
  }
};

router.get('/notifications', isAuthenticated, fetchNotifications);
router.post('/notifications/read/:id', isAuthenticated, markAsRead);
router.get('/notifications/latest', isAuthenticated, fetchLatestNotifications);
router.delete('/notifications/clear', isAuthenticated, clearNotifications);

export default router;