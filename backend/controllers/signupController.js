import { checkExistingUser, createUser } from '../models/authModel.js';

export const getSignupPage = (req, res) => {
  res.json({ message: "Signup page" });
};

export const postSignup = async (req, res) => {
  const { username, email, password } = req.body;
  const defaultPic = "https://fozznyfkxkrjkcppphpo.supabase.co/storage/v1/object/public/images/default.png";

  try {
    const existingUser = await checkExistingUser(username, email);

    if (existingUser) {
      return res.status(401).json({error: "Username or email is already in use. Please try again."});
    }

    const newUser = await createUser(username, email, password, defaultPic);
    
    if (newUser) {
      req.session.user_id = newUser.user_id;
      req.session.username = newUser.username;
      return res.status(201).json({ user_id: newUser.user_id });
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred. Please try again.");
  }
};
