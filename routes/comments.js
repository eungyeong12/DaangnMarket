const express = require('express');
const router = express.Router({ mergeParams: true }); // 라우터가 상위 라우터에서 매개변수를 상속함
const { validateComment, isLoggedIn, isCommentAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const comments = require('../controllers/comments');

router.post('/', isLoggedIn, validateComment, catchAsync(comments.createComment))

router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(comments.deleteComment))

module.exports = router;