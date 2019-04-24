const { src, dest, series, parallel, watch, lastRun } = require('gulp');
const gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    newer = require('gulp-newer'),
    fileinclude = require('gulp-file-include'),
    htmlhint = require("gulp-htmlhint"),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    csscomb = require('gulp-csscomb'),
    cssmin = require('gulp-cssmin'),
    gcmq = require('gulp-group-css-media-queries'),
    jshint = require('gulp-jshint'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    template = require('gulp-template'),
    filemapGenerator = require('gulp-filemap-generator'),
    browsersync = require("browser-sync").create(),
    del = require('del'),
    zip = require('gulp-zip')
    cached = require('gulp-cached'),
    remember = require('gulp-remember'),
    origin = "source",
    project = "build",
    docs = "docs";

const clean = async (done) => {
    await del([`${project}`]);
    done();
}

const html = ()=> src([`${origin}/**/*.html`, `!${origin}/include/*.html`, `!${origin}/map.html`], {since: lastRun(html)})
    .pipe(newer(`${project}`))
    .pipe(fileinclude({
        prefix: '@@',
        basepath: `${origin}/include`,
        context: {
            name: 'example'
        }
    }))
    .pipe(htmlhint('hint/.htmlhintrc'))
    .pipe(template())
    .pipe(dest(`${project}`))
    .pipe(browsersync.stream());

const generateFilemap = () => src([`${project}/**/*.html`], {since: lastRun(html)})
    .pipe(filemapGenerator({
        'template':`map.html`,
        'templatePath':`${origin}`,
        'title':'-',
        'author':'cruel32',
        'description':'설명이 없어요',
        'stream' : false,
        'baseDir' : `${project}`,
        'listName' : 'maps',
        'hrefBaseDir' : ``,
        'toJson' : false,
        "jsonName" : "maps",
        "jsonDest" : `${project}`
    }))
    .pipe(dest(`${project}`))


const scripts = ()=> src(`${origin}/js/**/*.js`, {since: lastRun(scripts)})
    .pipe(newer(`${project}/js/**/*.js`))
    .pipe(plumber({errorHandler : gutil.log}))
    .pipe(jshint())
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(dest(`${project}/js`))
    .pipe(browsersync.stream());


const css = () => src([`${origin}/css/**/*.{scss,sass}`,`!${origin}/css/import/**/*.{scss,sass}`], {since: lastRun(css)})
    .pipe(newer(`${project}/css/**/*.{scss,sass}`))
    .pipe(sass.sync().on('error', sass.logError))
    // .pipe(sass().on('error', sass.logError))
    .pipe(src([`${origin}/css/**/*.css`,`!${origin}/css/_icons.css`]), {passthrough: true})
    .pipe(autoprefixer())
    .pipe(gcmq())
    .pipe(csscomb({
        configPath: 'hint/.csscomb.json'
    }))
    .pipe(cssmin())
    .pipe(dest(`${project}/css`))
    .pipe(browsersync.stream());;

const images = () => src([
        `${origin}/images/**/*.{gif,jpeg,jpg,png,svg}`,
        `!${origin}/images/sprite/**/*.png`,
        `!${origin}/images/svg/**/*.svg`
    ], {since: lastRun(images)})
    .pipe(newer(`${project}/images/**/*.{gif,jpeg,jpg,png,svg}`))
    .pipe(dest(`${project}/images`))

//dest 폴더에 생성된 이미지를 한번더 압축
const imagesOptimization = () => src([
        `${project}/images/**/*.{gif,jpeg,jpg,png,svg}`,
    ], {since: lastRun(imagesOptimization)})
    .pipe(newer(`${project}/images/**/*.{gif,jpeg,jpg,png,svg}`))
    .pipe(imagemin())
    .pipe(dest(`${project}/images`))

const browserSyncInit = (done)=>{
    browsersync.init({
        index:'map.html',
        server: {
            baseDir: `${project}/`,
        },
        port: 5000
    },(err,bs)=>{
        // console.log('err : ', err);
        // console.log('server : ', bs.options.get('server'));
        // console.log('urls : ', bs.options.get('urls'));
    });
    done();
}

const packing = () => 
    src(`${project}/**/*`)
    .pipe(zip(`${project}.zip`))
    .pipe(dest(`./`))


const watcher = () => {
    watch([`${origin}/html/**/*.html`, `${origin}/json/**/*.json`], html).on('change', browsersync.reload);
    watch([`${origin}/css/**/*.{scss,sass.css}`], css).on('change', browsersync.reload);
    watch([`${origin}/js/**/*.js`], scripts).on('change', browsersync.reload);
    watch([`${origin}/images/**/*.{gif,jpeg,jpg,png,svg}`], images).on('change', browsersync.reload);
}

exports.default = series(clean, parallel(html, css, scripts, images), generateFilemap, parallel(browserSyncInit, watcher) );
exports.filemap = generateFilemap;
exports.clean = clean;
exports.optimize = imagesOptimization;
exports.pack = series(clean, parallel(html, css, scripts, images), packing);


