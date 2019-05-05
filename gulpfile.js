const { src, dest, series, parallel, watch, lastRun } = require('gulp');
const gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    newer = require('gulp-newer'),
    fileinclude = require('gulp-file-include'),
    htmlhint = require("gulp-htmlhint"),
    prettyHtml = require('gulp-pretty-html'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    csscomb = require('gulp-csscomb'),
    // cssmin = require('gulp-cssmin'),
    cssbeautify = require('gulp-cssbeautify'),
    gcmq = require('gulp-group-css-media-queries'),
    jshint = require('gulp-jshint'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    template = require('gulp-template'),
    filemapGenerator = require('gulp-filemap-generator'),
    fs = require('fs'),
    browsersync = require("browser-sync").create(),
    data = require('gulp-data'),
    del = require('del'),
    zip = require('gulp-zip'),
    origin = "source",
    project = "build",
    local = "local";

const clean = async (done) => {
    await del([`${project}`]);
    done();
}

const html = ()=> src([`${origin}/**/*.html`, `!${origin}/map.html`])//, {since: lastRun(html)}
    // .pipe(newer(`${project}`))
    .pipe(fileinclude({
        prefix: '@@',
        basepath: `${origin}/include`,
        context: {
            name: 'example'
        }
    }))
    .pipe(htmlhint('hint/.htmlhintrc'))
    .pipe(data((file)=>{
        return JSON.parse(fs.readFileSync(`${origin}/json/path.json`))
    }))
    .pipe(template())
    .pipe(prettyHtml())
    .pipe(dest(`${project}`))
    .pipe(browsersync.stream());

const htmlLocal = ()=> src([`${origin}/**/*.html`, `!${origin}/map.html`])//, {since: lastRun(html)}
    // .pipe(newer(`${project}`))
    .pipe(fileinclude({
        prefix: '@@',
        basepath: `${origin}/include`,
        context: {
            name: 'example'
        }
    }))
    .pipe(htmlhint('hint/.htmlhintrc'))
    .pipe(data((file)=>{
        return JSON.parse(fs.readFileSync(`${origin}/json/local.json`))
    }))
    .pipe(template())
    .pipe(prettyHtml())
    .pipe(dest(`${local}`))


const generateFilemap = () => src([`${project}/page/**/*.html`], {since: lastRun(html)})
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
    
const generateFilemapLocal = () => src([`${local}/page/**/*.html`], {since: lastRun(html)})
    .pipe(filemapGenerator({
        'template':`map.html`,
        'templatePath':`${origin}`,
        'title':'-',
        'author':'cruel32',
        'description':'설명이 없어요',
        'stream' : false,
        'baseDir' : `${local}`,
        'listName' : 'maps',
        'hrefBaseDir' : ``,
        'toJson' : false,
        "jsonName" : "maps",
        "jsonDest" : `${local}`
    }))
    .pipe(dest(`${project}`))


const scripts = ()=> src([`${origin}/js/**/*.js`], {since: lastRun(scripts)})
    .pipe(newer(`${project}/js/**/*.js`))
    .pipe(plumber({errorHandler : gutil.log}))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(jshint())
    .pipe(uglify())
    .pipe(dest(`${project}/js`))
    .pipe(browsersync.stream());

const scriptsLocal = ()=> src([`${origin}/js/**/*.js`], {since: lastRun(scripts)})
    .pipe(newer(`${local}/js/**/*.js`))
    .pipe(plumber({errorHandler : gutil.log}))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(jshint())
    .pipe(uglify())
    .pipe(dest(`${local}/js`))


const css = () => src([`${origin}/css/**/*.{css,scss,sass}`, `!${origin}/css/import/**/*.{scss,sass}`], {since: lastRun(css)})
    .pipe(newer(`${project}/css/**/*.{scss,sass}`))
    .pipe(sass.sync().on('error', sass.logError))
    // .pipe(sass().on('error', sass.logError))
    // .pipe(src([`${origin}/css/**/*.css`,`!${origin}/css/_icons.css`]), {passthrough: true})
    .pipe(autoprefixer())
    .pipe(gcmq())
    .pipe(csscomb({
        configPath: 'hint/.csscomb.json'
    }))
    // .pipe(cssmin())
    .pipe(cssbeautify())
    .pipe(dest(`${project}/css`))
    .pipe(browsersync.stream());;

const cssLocal = () => src([`${origin}/css/**/*.{css,scss,sass}`, `!${origin}/css/import/**/*.{scss,sass}`], {since: lastRun(css)})
    .pipe(newer(`${local}/css/**/*.{scss,sass}`))
    .pipe(sass.sync().on('error', sass.logError))
    // .pipe(sass().on('error', sass.logError))
    // .pipe(src([`${origin}/css/**/*.css`,`!${origin}/css/_icons.css`]), {passthrough: true})
    .pipe(autoprefixer())
    .pipe(gcmq())
    .pipe(csscomb({
        configPath: 'hint/.csscomb.json'
    }))
    // .pipe(cssmin())
    .pipe(cssbeautify())
    .pipe(dest(`${local}/css`))

const images = () => src([
        `${origin}/images/**/*.{gif,jpeg,jpg,png,svg}`,
        `!${origin}/images/sprite/**/*.png`,
        `!${origin}/images/svg/**/*.svg`
    ], {since: lastRun(images)})
    .pipe(newer(`${project}/images/**/*.{gif,jpeg,jpg,png,svg}`))
    .pipe(dest(`${project}/images`))

const imagesLocal = () => src([
        `${origin}/images/**/*.{gif,jpeg,jpg,png,svg}`,
        `!${origin}/images/sprite/**/*.png`,
        `!${origin}/images/svg/**/*.svg`
    ], {since: lastRun(images)})
    .pipe(newer(`${local}/images/**/*.{gif,jpeg,jpg,png,svg}`))
    .pipe(dest(`${local}/images`))

    
const font = ()=> src([`${origin}/font/**/*.{woff,eot,otf}`]).pipe(dest(`${project}/font`));
const fontLocal = ()=> src([`${origin}/font/**/*.{woff,eot,otf}`]).pipe(dest(`${local}/font`));

//dest 폴더에 생성된 이미지를 한번더 압축
const imagesOptimization = () => src([
        `${project}/images/**/*.{gif,jpeg,jpg,png,svg}`,
    ], {since: lastRun(imagesOptimization)})
    .pipe(newer(`${project}/images/**/*.{gif,jpeg,jpg,png,svg}`))
    .pipe(imagemin())
    .pipe(dest(`${project}/images`))

const browserSyncInit = (done)=>{
    browsersync.init({
        index:'/map.html',
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
    watch([`${origin}/**/*.html`], html).on('change', browsersync.reload);
    watch([`${origin}/css/**/*.{scss,sass.css}`], css).on('change', browsersync.reload);
    watch([`${origin}/js/**/*.js`], scripts).on('change', browsersync.reload);
    watch([`${origin}/images/**/*.{gif,jpeg,jpg,png,svg}`], images).on('change', browsersync.reload);
}

exports.default = series(clean, parallel(font, html, css, scripts, images), generateFilemap, parallel(browserSyncInit, watcher) );
exports.local = series(clean, parallel(fontLocal, htmlLocal, cssLocal, scriptsLocal, imagesLocal), generateFilemapLocal);
exports.clean = clean;
exports.optimize = imagesOptimization;
exports.pack = series(clean, parallel(font,html, css, scripts, images), packing);


