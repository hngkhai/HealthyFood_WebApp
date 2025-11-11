import { fetchPosts, generateSignedUrl, getUserSavedPosts, updateUserSavedPosts } from '../models/savePostModel.js';

export async function savePost(req, res) {
    const postId = req.params.id;
    const { saved } = req.body;
    const userId = req.session.user_id;

    try {
        // Retrieve the user's current saved posts
        const { user, error: fetchError } = await getUserSavedPosts(userId);

        if (fetchError) {
            console.error("Error fetching user data:", fetchError);
            return res.status(500).json({ message: "Error fetching user data." });
        }

        let updatedSavedPostsId = user.saved_post_id || [];

        // Update the saved posts array based on the saved state
        if (saved && !updatedSavedPostsId.includes(postId)) {
            updatedSavedPostsId.push(postId);
        } else if (!saved && updatedSavedPostsId.includes(postId)) {
            updatedSavedPostsId = updatedSavedPostsId.filter(id => id !== postId);
        }

        // Update the user's saved_post_id in the database
        const updateError = await updateUserSavedPosts(userId, updatedSavedPostsId);

        if (updateError) {
            console.error("Error updating saved posts:", updateError);
            return res.status(500).json({ message: "An error occurred while updating saved posts." });
        }

        return res.status(200).json({ message: saved ? "Post saved successfully." : "Post unsaved successfully." });
    } catch (error) {
        console.error("Unexpected error updating saved posts:", error);
        return res.status(500).json({ message: "An unexpected error occurred while updating saved posts." });
    }
}

export async function getPosts(req, res) {
    try {
        const { posts, error } = await fetchPosts();

        if (error) {
            console.error('Error fetching posts:', error);
            return res.status(500).send('Server error');
        }

        const signedPosts = await Promise.all(posts.map(async (post) => {
            if (post.image) {
                const { signedUrlData, error: signedUrlError } = await generateSignedUrl(post.image);

                if (signedUrlError) {
                    console.error("Error generating signed URL:", signedUrlError);
                    post.imageUrl = null;
                } else {
                    post.imageUrl = signedUrlData.signedUrl;
                }
            } else {
                post.imageUrl = null;
            }
            return post;
        }));

        res.json(signedPosts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).send('Server error');
    }
}
