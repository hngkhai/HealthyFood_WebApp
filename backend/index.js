// This is the main application for OnlyFoods
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add session middleware BEFORE the routes
app.use(session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public")); // Serve static files from the "public" folder

import passport from "passport";
app.use(passport.initialize());
app.use(passport.session());

// // Set the view engine to EJS and set the views directory
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// Remove EJS and static serving — this backend now only handles JSON routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example test route
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});


//Login Route
import authRoute from "./routes/authRoute.js";
app.use("/", authRoute);

//Signup Route
import signupRoute from './routes/signupRoute.js';
app.use(signupRoute);

//Setup Profile Route
import setupProfileRoute from './routes/setupProfileRoute.js';
app.use(setupProfileRoute);

//Main Page
import mainPageRoute from './routes/mainPageRoute.js';
app.use(mainPageRoute);

//View Post
import postRoute from './routes/postRoute.js';
app.use(postRoute);

//Delete Post
import deletePostRoute from './routes/deletePostRoute.js';
app.use(deletePostRoute);

//Flag Post
import flagPostRoute from './routes/flagPostRoute.js';
app.use(flagPostRoute);

//Like Post
import likePostRoute from './routes/likePostRoute.js';
app.use(likePostRoute);

//Comment Post
import commentPostRoute from './routes/commentPostRoute.js';
app.use(commentPostRoute);

//Save Post
import savePostRoute from './routes/savePostRoute.js';
app.use(savePostRoute);

//Profile
import profileRoute from './routes/profileRoute.js';
app.use(profileRoute);

//Settings
import settingsRoute from "./routes/settingsRoute.js";
app.use(settingsRoute)

//Notifications
import notificationsRoute from './routes/notificationsRoute.js';
app.use(notificationsRoute);

//Admin
import adminRoute from "./routes/adminRoute.js";
app.use(adminRoute);

//Logout
import logoutRoute from "./routes/logoutRoute.js";
app.use(logoutRoute);


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
