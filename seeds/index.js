const mongoose = require('mongoose'); // mongoose 불러오기
const info = require('./seedHelpers');
const Daangn = require('../models/daangn');

mongoose.connect('mongodb://127.0.0.1:27017/daan_gn');
/* mongoose를 MongoDB에 연결
 기본 mongo port는 27017, daan_gn은 데이터베이스 이름 */

const db = mongoose.connection; // mongoose.connection을 db 변수로 설정
db.on("error", console.error.bind(console, "connection error:"));
/* 데이터베이스에 대한 연결을 설정하는 동안 오류가 발생하면 콜백 함수가 실행된다. */
db.once("open", () => {
    console.log("Database connected");
});
/* 데이터베이스에 대한 연결이 성공적으로 설정되면 콜백 함수가 실행되고 데이터베이스가 
연결되었음을 나타내는 메시지를 콘솔에 기록한다. */

const seedDB = async () => {
    await Daangn.deleteMany({});
    for (let i = 0; i < 9; i++) {
        const daangn = new Daangn({
            author: '63826a66614320cef17df664',
            image: 'https://m.convenii.com/web/product/big/202112/46b30c6c210e1579b50b0a513514ac31.jpg',
            title: `${info[i].title}`,
            price: info[i].price,
            description: `${info[i].description}`,
            location: `${info[i].location}`,
        })
        await daangn.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
