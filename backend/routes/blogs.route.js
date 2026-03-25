import express from 'express';
import blogsCtrl from '../controllers/blogs.controller.js';
// uncomment when auth is implemented
// import authCtrl from '../controllers/auth.controller.js';

const router = express.Router();

router.route('/api/blogs')
  .get(blogsCtrl.listByUser)
  .post(blogsCtrl.create);

router.route('/api/blogs/current')
  .get(blogsCtrl.currentMonthPreview);

router.route('/api/blogs/tags')
  .get(blogsCtrl.listByTags);

router.route('/api/blogs/search')
  .get(blogsCtrl.listBySearchQuery);

router.route('/api/blogs/:blogId')
  .get(blogsCtrl.read)
  .put(blogsCtrl.hasAuthorization, blogsCtrl.update)
  .delete(blogsCtrl.hasAuthorization, blogsCtrl.remove);

router.param('blogId', blogsCtrl.blogByID);

export default router;
