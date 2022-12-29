module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next); // 오류가 발생하면 catch하여 함수에 전달
    }
}