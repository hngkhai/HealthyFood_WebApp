import postModel from '../models/postModel.js';
import userModel from '../models/userModel.js';

export default {
  async getPostDetails(req, res) {
    const postId = req.params.id;
    try {
      const post = await postModel.getPostById(postId);
      if (!post) {
        return res.status(404).send('Post not found');
      }

      const post_owner = await userModel.getUserById(post.user_id);
      if (!post_owner) {
        return res.redirect('/');
      }

      const user = await userModel.getUserBySessionId(req.session.user_id);
      if (!user) {
        return res.redirect('/');
      }

      post.ingredients = JSON.parse(post.ingredients || '[]');
      post.comments = post.comments || [];
      const isLiked = post.liked_user_id && post.liked_user_id.includes(user.user_id);
      const isSaved = user.saved_post_id && user.saved_post_id.includes(postId);

      res.json({ post, user, post_owner, isSaved, isLiked, postId });
    } catch (error) {
      console.error("Error fetching post details:", error);
      res.status(500).send("An error occurred. Please try again.");
    }
  },
};