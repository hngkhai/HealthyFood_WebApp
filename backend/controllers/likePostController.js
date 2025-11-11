import likePostModel from '../models/likePostModel.js';

export default {
  async likePost(req, res) {
    const postId = req.params.id;
    const userId = req.session.user_id;
    const { liked } = req.body;

    try {
      const { data: post, error: postError } = await likePostModel.getPostById(postId);

      if (postError || !post) return res.status(404).json({ message: 'Post not found' });

      let updatedLikes = post.likes;
      let likedUsers = post.liked_user_id || [];

      if (liked) {
        if (!likedUsers.includes(userId)) {
          likedUsers.push(userId);
          updatedLikes++;

          if (userId !== post.user_id) {
            await likePostModel.insertNotification({
              sender_user_id: userId,
              receiver_user_id: post.user_id,
              target_post_id: postId,
              type: 'Like',
            });
          }
        }
      } else {
        likedUsers = likedUsers.filter(id => id !== userId);
        updatedLikes = Math.max(0, updatedLikes - 1);
      }

      const { error: updateError } = await likePostModel.updateLikes(postId, updatedLikes, likedUsers);
      if (updateError) throw updateError;

      res.status(200).json({ likes: updatedLikes });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update like' });
    }
  }
};
