const express = require('express'); // express 불러오기
const router = express.Router();
const daangns = require('../controllers/daangns');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateDaangn } = require('../middleware');


router.route('/')
    .get(catchAsync(daangns.index))
    .post(isLoggedIn, validateDaangn, catchAsync(daangns.createDaangn))

router.get('/new', isLoggedIn, daangns.renderNewForm)

router.route('/:id')
    .get(catchAsync(daangns.showDaangn))
    .put(isLoggedIn, isAuthor, validateDaangn, catchAsync(daangns.updateDaangn))
    .delete(isLoggedIn, isAuthor, catchAsync(daangns.deleteDaangn))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(daangns.renderEditForm))


module.exports = router;