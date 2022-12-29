const express = require('express'); // express 불러오기
const path = require('path'); // 파일과 디렉토리 경로 작업을 위한 유틸리티 제공
const mongoose = require('mongoose');
/* mongoose는 MongoDB 및 Node.js를 위한 객체 데이터 모델링 라이브러리이다. 
 MongoDB 컬렉션의 문서에 대한 스키마를 정의하는 데 사용할 수 있으며 
 CRUD에 대한 간단한 API를 제공한다. */
const ejsMate = require('ejs-mate');
/* EJS-mate는 EJS 템플릿에서 레이아웃 파일 및 부분을 사용하는 기능을 추가하는 EJS 템플릿 엔진용 미들웨어이다. 
 Express.js 웹 프레임워크와 함께 사용하여 서버 렌더링 및 응용 프로그램을 만들 수 있다. */
const session = require('express-session');
/* express-session는 Express 애플리케이션에서 세션을 관리할 수 있는 node.js용 미들웨어이다.
 서버에 세션 데이터를 저장하고 세션 ID 쿠키를 클라이언트에 할당하여 세션을 식별한다. */
const flash = require('connect-flash');
/* 웹 애플리케이션에 메시지를 저장하고 표시할 수 있는 미들웨어 모듈이다. */
const ExpressError = require('./utils/ExpressError'); // 사용자 지정 오류 클래스 정의
const methodOverride = require('method-override');
/* PUT 또는 DELETE와 같은 HTTP 동사를 사용할 수 있도록 해줌 */
const passport = require('passport');
/* 웹 프로그램에서 사용자를 인증하는 간단하고 유연한 모듈식 방법을 제공한다.
로컬 인증(사용자 이름 및 암호 사용), OAuth(Google 또는 Facebook과 같은 타사 공급자 사용) 또는
사용자 지정 인증 방법과 같은 다양한 전략을 사용하여 사용자를 인증할 수 있다. */
const LocalStrategy = require('passport-local'); // 사용자 인증 전략 
const User = require('./models/user');

const userRoutes = require('./routes/users');
const daangnRoutes = require('./routes/daangns');
const commentRoutes = require('./routes/comments');


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

const app = express(); // express 실행하기

app.engine('ejs', ejsMate) // EJS를 템플릿 엔진으로 설정
app.set('view engine', 'ejs'); //view engine을 EJS로 설정
app.set('views', path.join(__dirname, 'views'))
/* views를 사용하는 템플릿 엔진이 있는 디렉토리로 설정 */

app.use(express.urlencoded({ extended: true }))
// 클라이언트로부터 받은 http 요청 메시지 형식에서 body 데이터를 해석하기 위해 사용
app.use(methodOverride('_method')); // method-override 미들웨어 사용
app.use(express.static(path.join(__dirname, 'public'))) // 정적 파일 제공

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!', // 세션 ID 쿠키에 서명하는 데 사용되는 문자열로, 쿠키가 변조되는 것을 방지하는 데 도움이 된다.
    resave: false, // 세션이 수정된 경우에만 저장되도록 함
    saveUninitialized: true, // 사용자가 세션을 수정하지 않은 경우에도 새 세션이 만들어지고 저장소에 저장됨
    cookie: {
        httpOnly: true, // JavaScript가 아닌 HTTP 프로토콜을 통해서만 쿠키에 액세스할 수 있음
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
/* 세션 관리를 사용하면 로그인 상태와 같은 사용자 세션에 대한 정보를 임시 데이터 저장소
(예: 메모리 또는 데이터베이스)에 저장할 수 있다. 이 정보는 서버에 저장되며 일반적으로 
사용자의 브라우저에 쿠키로 저장되는 세션 ID를 통해 사용자의 세션과 연결된다. */

app.use(flash()) // flash 사용

app.use(passport.initialize()); // Passport를 설정하고 Express 애플리케이션에 등록
app.use(passport.session()); // 사용자의 인증 상태를 복원
passport.use(new LocalStrategy(User.authenticate()));
// 사용자가 제공한 사용자 이름과 비밀번호를 확인하는 역할을 함
passport.serializeUser(User.serializeUser())
/* 세션에 저장하기 위해 사용자 정보를 직렬화하는 기능. 사용자 개체를 인수로 사용하고 
사용자를 나타내는 고유 식별자를 반환한다. 이 식별자는 세션에 저장되며 나중에 사용자 
정보를 검색하는 데 사용할 수 있다. */
passport.deserializeUser(User.deserializeUser())
/* 사용자 정보를 검색하는 기능. 고유 식별자를 인수로 사용하고 해당 식별자와 연결된 사용자 개체를 반환 */

app.use((req, res, next) => {
    /* req는 서버에 수행된 HTTP 요청을 나타내고 res는 클라이언트로 다시 보낼 응답을
    나타내며 next는 다음 미들웨어 함수에 제어를 전달하기 위해 호출되는 함수 */
    console.log(req.session)
    res.locals.currentUser = req.user;
    /* 인증된 사용자 정보의 값으로 설정됨 */
    res.locals.success = req.flash('success')
    /* 미들웨어 함수를 사용하여 설정된 성공 메시지의 값으로 설정됨. 
    뷰 템플릿에서 사용자에게 성공 메시지를 표시하는 데 사용할 수 있음 */
    res.locals.error = req.flash('error')
    /* 미들웨어 함수를 사용하여 설정된 오류 메시지의 값으로 설정됨. 
    뷰 템플릿에서 사용자에게 오류 메시지르 표시하는 데 사용할 수 있음 */
    next() // 지역 변수가 설정되면 함수가 호출되어 다음 미들웨어 함수에 제어를 전달
})
/* 뷰 템플릿에서 액세스할 수 있는 지역 변수를 설정. 지역 변수는 특정 경로 또는 미들웨어
함수 내에서만 사용할 수 있는 변수이며 일반적으로 서버에서 뷰 템플릿으로 데이터를 전달
하는 데 사용된다. */

app.use('/', userRoutes);
app.use('/daangns', daangnRoutes)
app.use('/daangns/:id/comments', commentRoutes)

app.get('/', (req, res) => { // 루트 경로에 대한 요청
    res.render('home') // ejs 파일 경로로 데이터를 전송
})

app.all('*', (req, res, next) => { // 모든 HTTP 요청 메서드에 대한 경로 처리
    next(new ExpressError('Page Not Found', 404))
    /* 다음 미들웨어 함수에 오류 개체를 전달한다. 오류 개체에는 메시지와 상태 속성이 
설정되어 있다. */
})
/* 이 경로 처리기는 모든 경로에 대한 모든 요청에 대해 실행된다. 요청 경로와 일치하는
다른 경로 처리기가 없고 응답을 보낸 경우 이 경로 처리기가 실행되고 오류 개체가 다음
미들웨어 함수로 전달된다. */
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})
/* 응답 개체의 상태 코드를 기본적으로 500으로 설정하거나 오류의 상태 코드로(지정된 경우)로
설정한다. 그런다음 "error" 템플릿을 렌더링하고 error 개체를 지역 변수로 전달한다. 
이 미들웨어 함수는 다른 모든 경로 및 미들웨어 함수 뒤에 미들웨어 스택의 끝에 배치하여
다른 경로 및 미들웨어에서 처리되지 않는 오류를 포착할 수 있도록 해야 한다. */
app.listen(3000, () => {
    console.log('Serving on port 3000') // 3000번 포트로 요청 받기
}) 