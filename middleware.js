const { daangnSchema, commentSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Daangn = require('./models/daangn');
const Comment = require('./models/comment');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) { // 사용자가 인증되지 않은 경우
        req.session.returnTo = req.originalUrl // 개체의 속성에 현재 URL을 저장
        return res.redirect('/login') // 로그인 페이지로 리디렉션
    }
    next() // 사용자가 인증되면 함수는 콜백을 호출하여 다음 미들웨어 함수에 전달
}

module.exports.validateDaangn = (req, res, next) => {
    const { error } = daangnSchema.validate(req.body); // 요청 body의 유효성 검사
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
        // 유효성 검사에 실패하면 유효성 검사 오류의 메시지와 상태 코드 400을 사용하여 새 개체를 만들고 오류를 throw 한다.
    } else {
        next();
    }
}

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const daangn = await Daangn.findById(id);
    if (!daangn.author.equals(req.user._id)) {
        req.flash('error', '권한이 없습니다.');
        return res.redirect(`/daangns/${id}`)
    }
    next()
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment.author.equals(req.user._id)) {
        req.flash('error', '권한이 없습니다.');
        return res.redirect(`/daangns/${id}`)
    }
    next()
}


