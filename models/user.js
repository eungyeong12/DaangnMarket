const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);
/* 스키마에 플러그인을 추가하면 passport-local-mongoose에서 제공하는 정적
메소드를 사용하여 사용자를 등록하고 인증할 수 있다. */

module.exports = mongoose.model('User', UserSchema);