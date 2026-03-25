import express from 'express';
import commentsCtrl from '../controllers/comments.controller.js';
// uncomment when auth is implemented
// import authCtrl from '../controllers/auth.controller.js';

const router = express.Router();

router.route('/api/comments')
  .get(commentsCtrl.allcomments)
  .post(commentsCtrl.create);

router.route('/api/comments/user')
  .get(commentsCtrl.listByUser);

router.route('/api/comments/:commentId')
  .get(commentsCtrl.read)
  .put(commentsCtrl.update);

router.param('commentId', commentsCtrl.commentByID);

export default router;
