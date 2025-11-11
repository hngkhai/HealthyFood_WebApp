import deletePostModel from '../models/deletePostModel.js';

export default {
  async deletePost(req, res) {
    const postId = req.params.id;

    try {
      const result = await deletePostModel.deletePostById(postId);

      if (!result.success) {
        return res.status(500).json({ message: 'Failed to delete post' });
      }

      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete post' });
    }
  }
};
