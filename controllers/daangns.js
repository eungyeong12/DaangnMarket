const Daangn = require('../models/daangn');

module.exports.index = async (req, res) => { // GET 요청에 대한 경로 처리
    const daangns = await Daangn.find({}) // 모든 게시물 불러오기. 비동기 함수 적용
    res.render('daangns/index', { daangns }) // index.js로 전달
}

module.exports.renderNewForm = (req, res) => { // GET 요청에 대한 경로 처리
    res.render('daangns/new') // "daangns/new" 템플릿을 렌더링
}

module.exports.createDaangn = async (req, res, next) => { // POST 요청에 대한 경로 처리
    const daangn = new Daangn(req.body.daangn); // request body를 사용해여 새 개체 만들기
    daangn.author = req.user._id; // 개체의 속성을 현재 로그인한 사용자로 설정
    await daangn.save() // 개체를 데이터베이스에 저장
    console.log(daangn); // 저장된 개체를 콘솔에 기록
    req.flash('success', '업로드 성공!') // 성공 플래시 메시지 설정
    res.redirect(`/daangns/${daangn._id}`) // 새로 만든 개체의 페이지로 사용자를 리디렉션함
}

module.exports.showDaangn = async (req, res) => { // GET 요청에 대한 경로 처리기
    const daangn = await Daangn.findById(req.params.id).populate({
        // URL 매개 변수로 전달되는 id를 기준으로 데이터베이스에서 개체를 찾음
        path: 'comments',
        populate: {
            path: 'author'
        }  // 개체의 배열을 전체 comments 개체와 해당 comments 개체의 속성으로 채움
    }).populate('author'); // 개체의 속성을 전체 사용자 개체로 채움
    if (!daangn) {
        req.flash('error', '해당 게시물을 찾을 수 없습니다.')
        return res.redirect('/daangns')
    } // 개체를 찾을 수 없는 경우 오류 플래시 메시지를 설정함
    res.render('daangns/show', { daangn }) // "daangns/show" 템플릿을 렌더링하고 개체를 지역 변수로 템플릿에 전달
}

module.exports.renderEditForm = async (req, res) => { // GET 요청에 대한 경로 처리
    const { id } = req.params; // 요청 매개 변수 개체에서 매개 변수를 추출
    const daangn = await Daangn.findById(id) // 데이터베이스에서 개체 찾기
    if (!daangn) {
        req.flash('error', '해당 게시물을 찾을 수 없습니다.')
        return res.direct('./daangns');
    } // 개체를 찾을 수 없는 경우 오류 플래시 메시지를 설정
    res.render('daangns/edit', { daangn }) // "daangns/edit" 템플릿을 렌더링하고 개체를 템플릿에 지역 변수로 전달
}

module.exports.updateDaangn = async (req, res) => { // 업데이트를 위한 HTTP 요청을 처리하는 함수를 내보내는 함수
    const { id } = req.params; // 요청의 개체에서 매개 변수를 추출
    const daangn = await Daangn.findByIdAndUpdate(id, { ...req.body.daangn })
    // 지정된 Daangn 리소스를 찾고 요청 body의 새 데이터로 업데이트
    req.flash('success', '수정되었습니다!') // 요청 개체의 성공 메시지를 추가
    res.redirect(`/daangns/${daangn._id}`) // 응답을 업데이트된 Daangn 리소스의 URL로 리디렉션
}

module.exports.deleteDaangn = async (req, res) => { // 삭제를 위한 HTTP 요청을 처리하는 함수를 내보내는 함수
    const { id } = req.params; // 요청의 개체에서 매개 변수를 추출
    await Daangn.findByIdAndDelete(id); // id를 찾고 삭제
    req.flash('success', '게시물을 삭제하였습니다') // 요청의 개체에 성공 메시지 추가
    res.redirect('/daangns'); // 응답을 모든 Daangn 리소스 목록의 URL로 리디렉션
}