const path = require("path");
const fs = require("fs");
const del = require('del');
const gulp = require('gulp'); //https://gulpjs.com/
const javascriptObfuscator = require("gulp-javascript-obfuscator");// https://github.com/javascript-obfuscator/javascript-obfuscator#javascript-obfuscator-options
const imagemin = require('gulp-imagemin'); //https://github.com/sindresorhus/gulp-imagemin
const imageminPngquant = require('imagemin-pngquant');//https://github.com/imagemin/imagemin-pngquant

const folderP = path.resolve(__dirname, '../../');

let build_config = {};
//读取配置
gulp.task('read_build_config', (cb) => {
    const data_build_config = fs.readFileSync(path.join('./', 'buildConfig.json'));
    build_config = JSON.parse(data_build_config.toString()).web;
    console.log('build_config', build_config);
    cb();
})

//压缩图片
gulp.task('imagemin', (cb) => {
    // 同步读取
    const data_buildtexture = fs.readFileSync(path.join(folderP, '$buildtexture.json'));
    const _buildtexture_config = JSON.parse(data_buildtexture.toString());
    const _texture_config = build_config.texture || {};
    const pack_files = {};
    let total_count = 0;
    for (const key in _buildtexture_config) {
        if (_buildtexture_config.hasOwnProperty(key)) {
            const element = _buildtexture_config[key];
            if (_texture_config[element.name]) {
                const targetPath = `${folderP}/build/web-mobile/res/raw-assets/**/${key}*.png`;
                if (!pack_files[element.name]) {
                    pack_files[element.name] = [];
                    total_count++;
                }
                pack_files[element.name].push(targetPath);
            }
        }
    }
    let cur_count = 0;
    for (const key in pack_files) {
        if (pack_files.hasOwnProperty(key)) {
            const element = pack_files[key];
            console.log(`start.. ${key}`);
            const cfg = _texture_config[key];
            console.log(cfg);
            gulp.src(element)
                .pipe(imagemin([
                    imagemin.gifsicle(), imagemin.jpegtran(), imagemin.optipng(), imagemin.svgo(),
                    imageminPngquant(cfg)
                ], { verbose: true }))
                .pipe(gulp.dest(`${folderP}/build/web-mobile/res/raw-assets/`))
                .on("end", () => {
                    console.log(`end.. ${key}`);
                    cur_count++;
                    console.log(`progress ${cur_count}/${total_count}`);
                    if (cur_count >= total_count) {
                        cb();
                    }
                });
        }
    }
})

// 清理备份
gulp.task('clean_backup', function (cb) {
    del.sync([`${folderP}/build/web-mobile_backup/`], { force: true });
    cb()
});

// 备份
gulp.task('backup', function (cb) {
    gulp.src([`${folderP}/build/web-mobile/**`])
        .pipe(gulp.dest(`${folderP}/build/web-mobile_backup/`))
        .on("end", cb);
});

// 混淆 
gulp.task("javascriptObfuscator", function (cb) {
    gulp.src([`${folderP}/build/web-mobile/src/*.js`])
        .pipe(javascriptObfuscator(build_config["javascript-obfuscator-options"] || {}))
        .pipe(gulp.dest(`${folderP}/build/web-mobile/src/`))
        .on("end", cb);
});

gulp.task('default', gulp.series(gulp.parallel('read_build_config', 'clean_backup'), 'backup', gulp.parallel('imagemin', 'javascriptObfuscator')));