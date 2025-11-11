import setProfileModel from '../models/setupProfileModel.js';

function calculateAge(birthday) {
  const birthDate = new Date(birthday);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // Check if the birthday hasn't occurred yet this year
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

// Get the setup profile page
const getSetupProfilePage = (req, res) => {
  const username = req.session.username;
  
  // You can pass user data or other required information here
  res.json({ username });
};

// Update profile information
const updateProfile = async (req, res) => {
  const { height, weight, targetWeight, birthday } = req.body;
  const imageFile = req.file; // Get the uploaded image file
  const age = calculateAge(birthday);
  
  try {
    let imageUrl = null;

    if (imageFile) {
      // Upload image and get URL
      imageUrl = await setProfileModel.uploadProfileImage(imageFile);
    } else {
      imageUrl = 'https://fozznyfkxkrjkcppphpo.supabase.co/storage/v1/object/public/images/default.png';
    }

    // Update user profile in Supabase
    const updateResult = await setProfileModel.updateUserProfile(req.session.user_id, height, weight, targetWeight, birthday, imageUrl, age);

    if (updateResult) {
      res.status(200).send("Profile set up successfully.");
    } else {
      res.status(500).send("Error updating profile. Please try again.");
    }
  } catch (err) {
    console.error("An error occurred while setting up the profile:", err);
    res.status(500).send("An error occurred. Please try again.");
  }
};

export default {
  getSetupProfilePage,
  updateProfile,
};
