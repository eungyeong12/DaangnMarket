const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({ // 두 개의 필드가 있는 문서의 스키마 정의
    body: String, // 댓글의 텍스트를 포함할 문자열 필드
    author: { // 속성을 포함하는 개체 필드
        type: Schema.Types.ObjectId, // mongodb 컬렉션에서 문서의 고유 식별자를 저장하는 데 사용되는 형식
        ref: 'User' // 이 필드가 User 컬렉션에 있는 문서의 _id에 대한 참조임을 의미
    }
});

module.exports = mongoose.model("Comment", commentSchema);