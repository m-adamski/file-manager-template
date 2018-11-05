var path = require("path");
var gulp = require("gulp");
var sassPlugin = require("gulp-sass");
var sassLintPlugin = require("gulp-sass-lint");
var sourceMapPlugin = require("gulp-sourcemaps");
var browserSync = require("browser-sync").create();

gulp.task("default", gulp.series(lintSass, compileSass, copyImages));
gulp.task("watch-sync", gulp.series(lintSass, compileSass, copyImages, function() {
    browserSync.init({
        server: "./dist"
    });

    gulp.watch(
        "./source/scss/**/*.scss",
        gulp.series(lintSass, compileSass, copyImages)
    );

    gulp.watch(
        "./source/images",
        copyImages
    );
}));

function lintSass(afterDone) {
    gulp.src("./source/scss/**/*.scss")
        .pipe(sassLintPlugin())
        .pipe(sassLintPlugin.format())
        .pipe(sassLintPlugin.failOnError());

    afterDone();
}

function compileSass(afterDone) {
    gulp.src(["./source/scss/template.scss", "./source/scss/demo.scss"])
        .pipe(sourceMapPlugin.init())
        .pipe(sassPlugin().on("error", sassPlugin.logError))
        .pipe(sourceMapPlugin.write("./"))
        .pipe(gulp.dest("./dist/css"))
        .pipe(browserSync.stream());

    afterDone();
}

function copyImages(afterDone) {
    gulp.src("./source/images/**/*")
        .pipe(gulp.dest("./dist/images"));

    afterDone();
}
