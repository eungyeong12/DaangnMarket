const Daangn = require('../models/daangn');
const Comment = require('../models/comment');

module.exports.createComment = async (req, res) => { // 새 댓글을 생성하기 위한 HTTP 요청을 처리하는 함수를 내보내는 함수
    const daangn = await Daangn.findById(req.params.id) // 요청의 개체에 지정된 id 찾기
    const comment = new Comment(req.body.comment) // 요청 body의 데이터로 새 개체 만들기
    comment.author = req.user._id // 개체의 속성을 요청한 사용자의 속성으로 설정
    daangn.comments.push(comment); // 새 개체를 개체의 배열에 푸시
    await comment.save(); // 새 개체를 데이터베이스에 저장
    await daangn.save(); // 업데이트된 개체를 데이터베이스에 저장
    req.flash('success', '새 댓글을 작성했습니다!') // 요청 개체의 개체에 성공 메시지를 추가
    res.redirect(`/daangns/${daangn._id}`); // 새 댓글이 있는 Daangn 리소스의 URL에 대한 응답을 리디렉션
}

module.exports.deleteComment = async (req, res) => { // 댓글을 삭제하기 위한 HTTP 요청을 처리하는 함수를 내보내는 함수
    const { id, commentId } = req.params; // 요청의 개체에서 매개 변수 추출
    await Daangn.findByIdAndUpdate(id, { $pull: { comment: commentId } });
    // 모델의 메서드를 사용하여 지정된 Daangn 리소스를 찾고 배열에서 지정된 댓글을 끌어오기
    await Comment.findByIdAndDelete(commentId); // 댓글 제거
    req.flash('success', '댓글을 삭제하였습니다') // 요청 개체의 개체에 성공 메시지를 추가
    res.redirect(`/daangns/${id}`); // 응답을 Daangn 리소스의 URL로 리디렉션
}