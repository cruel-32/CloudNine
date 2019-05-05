'use strict'
const responsive = {
    xs: 576,
    sm: 768,
    md: 1000,
    lg: 1280,
    xl: 3000
}
const getDevice = width=> Object.keys(responsive).find(size => width < responsive[size]);


//responsive js코드 
$(window).resize((e)=>{
    const device = getDevice($(window).width());

    switch(device){
        case 'xl' :
            //가장 큰화면
        break;

        case 'lg' :
            //큰 화면
        break;

        case 'md' :
            //테블릿화면
        break;
        
        case 'sm' :
            //큰 모바일 화면
        break;

        case 'xs' :
            //모바일 화면
        break;

        default :
            //기본화면
    }
});

$(function () {
    $('[data-toggle="tooltip"]').tooltip({
        boundary: 'window'
    })
})



/* spinner 호출 - 확인 후 삭제하세요 */ 
const $spinner = $("#spinner");
$spinner.show(); //로딩바 호출

setTimeout(()=>{
    $spinner.hide(); //로디방 숨기기
},1000);
