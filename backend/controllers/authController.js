import { comparePasswords, getFlagsByUsername, getUserByUsername } from "../models/authModel.js";

// Controller for login
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Get user from database
    const { user, error: userError } = await getUserByUsername(username);
    if (userError || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check password
    const isPasswordValid = await comparePasswords(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Get user's flags (restrictions)
    const { flags, error: flagsError } = await getFlagsByUsername(username);
    if (flagsError) {
      return res.status(500).json({ error: "Failed to get user flags" });
    }

    // Process flags for restrictions
    if (flags.length > 0) {
      const banFlag = flags.find(flag => flag.restriction_type === 'Ban');
      if (banFlag) {
        return res.status(403).json({ error: "You have been banned. Access denied." });
      }

      const suspendFlag = flags.find(flag => flag.restriction_type === 'Suspend');
      if (suspendFlag) {
        const suspendDuration = 30 * 1000; // 30 seconds
        const nowUtc = new Date();
        const now = new Date(nowUtc.getTime() + (8 * 60 * 60 * 1000)); // Adjust timezone
        const suspendTime = new Date(suspendFlag.created_time);
        const timeRemaining = now - suspendTime;

        if (timeRemaining < suspendDuration) {
          return res.status(403).json({ error: "You have been suspended. Please contact support." });
        }
      }
    }

    // No restriction, proceed with login
    req.session.user_id = user.user_id;
    req.session.username = username;

    res.status(200).json({ 
      message: "Login successful", 
      user: {
        user_id: user.user_id,
        username: user.username,
        user_type: user.user_type
      }
    });
    
  } catch (err) {
    console.error("Error during login process:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
