import bcrypt from "bcrypt";
import supabase from "../config/supabaseClient.js";

const saltRounds = 10;

export const getUserByUsername = async (username) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !data) {
    return { error: "User not found" };
  }
  
  return { user: data };
};

export const comparePasswords = async (loginPassword, storedHashedPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(loginPassword, storedHashedPassword, (err, result) => {
      if (err) {
        reject("Error comparing passwords");
      }
      resolve(result);
    });
  });
};

export const getFlagsByUsername = async (username) => {
  const { data, error } = await supabase
    .from('flags')
    .select('restriction_type, created_time')
    .eq('username', username);

  if (error) {
    return { error: "Error fetching flags" };
  }

  return { flags: data };
};

export const checkExistingUser = async (username, email) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .or(`username.eq.${username},email.eq.${email}`)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
};

export const createUser = async (username, email, password, defaultPic) => {
  try {
    // Hash password
    const hash = await bcrypt.hash(password, saltRounds);

    // Insert new user into the database
    const { data, error } = await supabase
      .from('users')
      .insert([
        { username, email, password_hash: hash, profile_picture: defaultPic }
      ]);

    if (error) {
      console.error("Error inserting user:", error);
      throw error;
    }

    // Fetch the user data after insertion
    const { data: user, error: er } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (er) {
      throw er;
    }

    return user;
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
};