import express from 'express';
import blogsCtrl from '../controllers/blogs.controller.js';
import authCtrl from '../controllers/auth.controller.js';

const router = express.Router();

router.route('/api/blogs')
  .get(authCtrl.requireSignin, blogsCtrl.listByUser)
  .post(authCtrl.requireSignin, blogsCtrl.create);

router.route('/api/blogs/all')
  .get(blogsCtrl.list);

router.route('/api/blogs/current')
  .get(authCtrl.requireSignin, blogsCtrl.currentMonthPreview);

router.route('/api/blogs/tags')
  .get(blogsCtrl.listByTags);

router.route('/api/blogs/search')
  .get(blogsCtrl.listBySearchQuery);

router.route('/api/blogs/:blogId')
  .get(blogsCtrl.read)
  .put(authCtrl.requireSignin, blogsCtrl.hasAuthorization, blogsCtrl.update)
  .delete(authCtrl.requireSignin, blogsCtrl.hasAuthorization, blogsCtrl.remove);

router.param('blogId', blogsCtrl.blogByID);

export default router;
