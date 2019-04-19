var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify');
var gulpIgnore = require('gulp-ignore');
var stripDebug = require('gulp-strip-debug');
var replace = require('gulp-replace');

gulp.task('default', function () {
    // 将你的默认的任务代码放在这
});



gulp.task('docs', function (callback) {
    var docsPath = 'docs/';
    del([
        docsPath + '*',
    ], callback);
    return gulp.src('dist/**/*')
        .pipe(gulp.dest(docsPath))
});

gulp.task('minapi', function (done) {
    var destPath = 'apiMin';
    try {
        del([
            destPath
        ]);
    } catch (e) { console.log(e); }

    var orig = '-debug.js';
    gulp.src('api/**/*.js')
        .pipe(replace(/(\/\*[\S]*CRISPR-GULP-BEGIN[\S]*\*\/)([\s\S]*)(\/\*[\S]*CRISPR-GULP-END[\S]*\*\/)/igm, function (match, p1, p2, p3, offset, string) {
            // Replace foobaz with barbaz and log a ton of information
            // See http://mdn.io/string.replace#Specifying_a_function_as_a_parameter
            // console.log('Found ' + match + ' with param ' + p1 + ' at ' + offset + ' inside of ' + string);

            var name = p1.match(/action:[^-*]*/im)[0]
                .match(/:[\S]*/im)[0]
                .split(':')
                .pop()
                .toUpperCase();

            console.log(name);


            var result;
            switch (name) {
                case 'DEL':
                    result = '';
                    break;
                default:
                    break;
            }

            console.log(result);

            return result;
        }))
        .pipe(stripDebug())
        .pipe(minify({
            ext: {
                src: orig,//源文件的后缀
                min: '.js'//经过minify的文件所命名的后缀
            },
        }))
        .pipe(gulpIgnore.exclude('*' + orig))//可以用于过滤文件
        // .pipe(concat('bundle.min.js'))
        // .pipe(uglify({ mangle: false }))
        .pipe(gulp.dest(destPath));
    // console.log('minapi任务已完成');
    done();
});



gulp.task('prepublish',
    gulp.series(
        // done => { console.log('> gulp prepublish'); done() },//gulp 4x版本一定要"async completion" 详情请参考:http://t.cn/EXBpo2u
        'minapi',
    )
);