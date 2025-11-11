import express from 'express';
import { getSignupPage, postSignup } from '../controllers/signupController.js';

const router = express.Router();

// Get signup page
router.get("/signup", getSignupPage);

// Post signup form
router.post("/signup", postSignup);

export default router;
