(() => {
    'use strict'

    // 사용자 지정 부트스트랩 유효성 검사 스타일을 적용할 모든 양식 가져오기
    const forms = document.querySelectorAll('.validated-form')

    Array.from(forms)
        .forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                } // 양식이 유효하지 않은 경우 양식이 제출되지 않도록 함

                form.classList.add('was-validated') // 양식이 제출되고 확인되었을 때 양식의 스타일을 다르게 지정할 수 있음
            }, false)
        })
})()