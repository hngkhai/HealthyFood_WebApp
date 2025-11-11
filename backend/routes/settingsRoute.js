import express from 'express';
import settingsController from '../controllers/settingsController.js';

const router = express.Router();

const isAuthenticated = (req, res, next) => {
    if (req.session.user_id) {
      next();
    } else {
      res.redirect('/');
    }
  };

router.get('/settings', isAuthenticated, settingsController.getSettingsPage);
router.post('/settings/update-email', isAuthenticated, settingsController.updateEmail);
router.post('/settings/update-password', isAuthenticated, settingsController.updatePassword);
router.post('/settings/delete-account', isAuthenticated, settingsController.deleteAccount);
router.delete('/delete-old-meals', settingsController.deleteOldMeals);

export default router;
