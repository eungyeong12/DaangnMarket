const User = require('../models/user');

module.exports.renderRegister = (req, res) => { // 등록 템플릿을 렌더링하기 위한 HTTP 요청ㅇ르 처리하는 함수를 내보내는 함수
    res.render('users/register');  // "users/register" 템플릿을 렌더링
}

module.exports.register = async (req, res) => { // 새 사용자 등록을 위한 HTTP 요청을 처리하는 함수를 내보내는 함수
    try {
        const { email, username, password } = req.body;
        // 요청 body에서 이메일, 아이디, 비밀번호를 추출
        const user = new User({ email, username });
        // 이메일, 아이디가 있는 새 개체를 만듦
        const registeredUser = await User.register(user, password);
        // 모델의 메서드를 사용하여 새 사용자를 등록하고 암호를 설정함
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', '회원가입을 축하합니다.'); // 성공 메시지 추가
            res.redirect('/daangns') // Daangn 리소스 목록의 URL로 리디렉션
        })
        // 요청 객체의 메서드를 사용하여 사용자를 로그인함
    } catch (e) {
        req.flash('error', e.message) // 로그인 프로세스 중에 오류가 발생하면 요청 객체의 객체에 오류 메시지를 추가
        res.redirect('register') // register로 리디렉션
    }
}

module.exports.renderLogin = (req, res) => { // 로그인 템플릿을 렌더링하기 위한 HTTP 요청을 처리하는 함수를 내보내는 함수
    res.render('users/login'); // "users/login" 템플릿을 렌더링
}

module.exports.login = (req, res) => { // 기존 사용자의 로그인을 위한 HTTP 요청을 처리하는 함수를 내보내는 함수
    req.flash('success', '환영합니다!'); // 요청 개체의 개체에 성공 메시지를 추가
    const redirectUrl = req.session.returnTo || '/daangns';
    // 요청 개체의 개체에서 속성을 확인하여 응답을 리디렉션할 URL을 결정.
    delete req.session.returnTo // 요청 개체의 개체에서 속성을 삭제
    res.redirect(redirectUrl) // redirectUrl로 리디렉션
}

module.exports.logout = (req, res, next) => { // 세션에서 사용자를 로그아웃하는 함수를 내보냄
    req.logout((err) => { // 사용자의 세션을 종료하고 요청 개체에서 사용자 정보를 제거
        if (err) next(err); // 로그아웃하는 동안 오류가 발생하면 함수는 오류를 함수에 전달하여 오류를 처리
        res.redirect('/daangns') // "/daangns"로 리디렉션
    })
} 