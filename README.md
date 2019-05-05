# CloudNine Project

## 참고사이트

- bootstrap 템플릿 : https://blackrockdigital.github.io/startbootstrap-modern-business/

- 상팔기타 youtube : https://www.youtube.com/user/MrSangpal

- 현대카드 옴니추어 : /data/2차 개발 옴니추어 추가 항목_pc,mobile/PC

## 작업환경
- gulp 빌드 툴
- build 폴더를 보고 작업하시면 됩니다.

## gulp
+ 전체 html파일을 확인하시거나 커스텀하시려면 gulp로 로컬서버를 가동하여 확인하시거나 build 폴더안에 파일을 확인하세요.

`1.` gulp 설치 (터미널에서 해당 루트 디렉토리에서 명령어 입력)
```js
npm i gulp-cli -g //gulp-cli 전역설치 
```

`2.` 관련 모듈 설치
```js
npm i //관련 모듈 설치
```

`3.` gulp 로컬서버 돌리기 (build 파일 생성)
```js
gulp
```

`4.` 로컬서버 없이 브라우저에서 바로 띄우고 싶을 경우 (build 파일을 local폴더에 상대경로로 생성)
```js
gulp local //local 폴더에 생성
```

## html => angular

- 공통소스 import
```html
<!-- bootstrap -->
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>  
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

<!-- fontawsome -->
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
```

- 공통소스를 npm으로 설치후 angular 프로젝트로 import 하셔도 됩니다. 
```js
npm i bootstrap
npm i jquery
```

- source폴더 html파일중 **include로 된 파일**을 component화 하시고 iterate 해주시면 됩니다
```html
<div ng>
    @@include('component/login_modal.html')
</div>
```
