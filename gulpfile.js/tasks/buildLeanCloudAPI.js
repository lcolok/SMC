var gulp = require('gulp');
var del = require('del');
var replace = require('gulp-replace');
const gap = require('gulp-append-prepend');
var concat = require('gulp-concat');
const path = require('path');
var gulpIgnore = require('gulp-ignore');
var fs = require('fs');
let uglify = require('gulp-uglify-es').default;
var gutil = require('gulp-util');

module.exports = function (done) {

    var configPath = path.resolve('config/api.config');
    var config = require(configPath);

    var destPath = config.apiBuildDest;

    try {
        del([
            destPath
        ]);
    } catch (e) { console.log(e); }

    // var orig = '-debug.js';
    // gulp.src('api/*.js')//只读取根目录的js文件
    //     // .pipe(gulpIgnore.exclude('public/**/*'))//用于过滤public文件夹
    //     .pipe(gulpIgnore.exclude(['index.js']))//用于过滤config文件夹
    //     .pipe(gulpIgnore.exclude(['config/**/*']))//用于过滤config文件夹
    //     .pipe(replace(/\/\*([\S]*CRISPR-GULP[\S]*)\*\/([\s\S]*?)(\/\*\1\*\/)/igm, (...res) => CG(res)))
    //     .pipe(replace(/\/\*([\S]*CG[\S]*)\*\/([\s\S]*?)(\/\*\1\*\/)/igm, (...res) => CG(res)))
    //     .pipe(gap.appendText(`AV_Cloud_Define("thisFunc",r=>thisFunc(r));`))
    //     .pipe(replace(/thisFunc/igm, function () {
    //         return this.file.relative.split('.').shift();//获取文件名
    //     }))
    //     // .pipe(stripDebug())//删除所有console
    //     .pipe(concat(config.bundleName))
    //     .pipe(gap.prependText("var AV_Cloud_Define=AV.Cloud.define"))
    //     .pipe(gap.prependText(getAllRequires(config)))//统一加上需要引入的函数库

    //     // .pipe(minify({
    //     //     ext: {
    //     //         src: orig,//源文件的后缀
    //     //         min: '.js'//经过minify的文件所命名的后缀
    //     //     },
    //     // }))
    //     // .pipe(gulpIgnore.exclude('*' + orig))//可以用于过滤文件

    //     // .pipe(uglify({
    //     //     toplevel: true,
    //     // }))
    //     .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    //     .pipe(gulp.dest(destPath));
    // // console.log('minapi任务已完成');

    gulp.src('api/index.js')//只读取根目录的js文件
    .pipe(gulp.dest(destPath));
    
    done();

    function getAllRequires(config) {
        // var ar = fs.readFileSync(path);
        var arPrependText = '';
        // console.log(arJSON);
        for (var i in config.requires) {
            arPrependText += `const ${i} = require('${config.requires[i]}');`
        }
        return arPrependText
        // console.log(arPrependText);
    }

    function CG() {

        var [match, p1, p2, p3, offset, string] = arguments[0];

        // Replace foobaz with barbaz and log a ton of information
        // See http://mdn.io/string.replace#Specifying_a_function_as_a_parameter
        // console.log('Found ' + match + ' with param ' + p1 + ' at ' + offset + ' inside of ' + string);

        var name = p1.match(/(action)?:[a-z]+/im)[0]
            .match(/:[\S]*/im)[0]
            .split(':')
            .pop()
            .toUpperCase();

        // console.log(name);

        /* result = actions[name]; */
        var result = match;//默认是不替换,匹配部分换成结果,就是不替换
        switch (name) {
            case 'D':
            case 'DEL':
                result = '';
                break;
            case 'F':
            case 'FILENAME':
                result = `"${this.file.relative.split('.').shift()}"`
                break;
            default:

                break;
        }

        // console.log(result);

        return result;
    }

};
