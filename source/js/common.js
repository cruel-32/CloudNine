'use strict'
const responsive = {
    xs: 576,
    sm: 768,
    md: 1000,
    lg: 1280,
    xl: 3000
}
const getDevice = width=> Object.keys(responsive).find(size => width < responsive[size]);


//스크립트가 없이 css만으로 모든 것을 responsive하게 코딩하는게 불가능합니다.
//메인에 큰 이미지영역의 높이만큼 탭영역 높이도 맞춰주어야 합니다. (resize 시에도)
//일단 jquery로 짜두긴 했는데 추후에 angular 코드로 바꿔주셔도 됩니다.

const $mediaSection = $('.media-section');
const $tabWrap = $('.tab-wrap');
$tabWrap.height($mediaSection.height())

$(window).resize((e)=>{
    const device = getDevice($(window).width());

    $tabWrap.height($mediaSection.height())
    switch(device){
        case 'xl' :
            $tabWrap.height($mediaSection.height())
        break;
        case 'lg' :
            $tabWrap.height($mediaSection.height())
        break;
        case 'md' :
            $tabWrap.height($mediaSection.height())
        break;
        case 'sm' :
            $tabWrap.height('auto')
        break;
        case 'xs' :
            $tabWrap.height('auto')
        break;
    }
});

AOS.init();
