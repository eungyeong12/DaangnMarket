const mongoose = require('mongoose');
const Comment = require('./comment');
const Schema = mongoose.Schema;

const DaangnSchema = new Schema({
    image: String,
    title: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

DaangnSchema.post('findOneAndDelete', async function (doc) { // mongoose 스키마의 메서드를 사용하여 쿼리 후에 실행될 미들웨어 함수를 등록
    if (doc) {
        await Comment.deleteMany({ // 문서가 삭제된 경우 삭제된 문서와 연결된 모든 문서 삭제
            _id: {
                $in: doc.comments // 필드가 문서의 필드에 포함된 값 배열에 있는 문서와 일치해야 함
            }
        })
    }
});

module.exports = mongoose.model('Daangn', DaangnSchema)
/* 스키마를 이용한 모델을 만들고 내보내기 ('모델 이름', 스키마) */