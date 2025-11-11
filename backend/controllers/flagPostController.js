import { getUserByUsername, updateFlagDetails } from '../models/flagPostModel.js';

export async function flagPost(req, res) {
    const { username, flag_reason, flag_description, postID } = req.body;

    try {
        // Step 1: Find the user by username
        const { data: user, error: userError } = await getUserByUsername(username);
        if (userError || !user) {
            return res.status(404).json({ message: "User not found" });
        }

        const owner_username = user.username;

        // Step 2: Update the user's flag details
        const { error: updateError } = await updateFlagDetails(owner_username, flag_reason, flag_description, postID);
        if (updateError) {
            console.error("Error updating user:", updateError);
            return res.status(500).json({ message: "Error submitting the report." });
        }

        // Step 3: Return success response
        res.status(200).json({ message: "Report submitted successfully!" });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
}
