import commentPostModel from '../models/commentPostModel.js';

export default {
  async addComment(req, res) {
    const postId = req.params.id;
    const { text } = req.body;
    const userId = req.session.user_id;

    try {
      const { data: post, error: postError } = await commentPostModel.getPostById(postId);

      if (postError || !post) {
        return res.status(404).send('Post not found');
      }

      const comments = post.comments || [];
      const newComment = {
        user: req.session.username || 'Anonymous',
        text,
        timestamp: new Date().toISOString(),
      };
      comments.push(newComment);

      const { error: updateError } = await commentPostModel.updateComments(postId, comments);
      if (updateError) {
        return res.status(500).json({ error: 'Failed to add comment' });
      }

      if (userId !== post.user_id) {
        await commentPostModel.insertNotification({
          sender_user_id: userId,
          receiver_user_id: post.user_id,
          target_post_id: postId,
          type: 'Comment',
        });
      }

      res.json(newComment);
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};
