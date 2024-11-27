const babel = require("gulp-babel");
const del = require("del");
const gulp = require("gulp");
const mocha = require("gulp-mocha");

function clean() {
    return del(["lib"]);
}

function build() {
    return gulp.src("src/**/*.js").pipe(babel()).pipe(gulp.dest("lib"));
}

function test() {
    return gulp.src("test/**.js").pipe(
        mocha({
            ui: "bdd",
            reporter: "spec",
            timeout: typeof v8debug === "undefined" ? 2000 : Infinity, // NOTE: disable timeouts in debug
        }),
    );
}

exports.clean = clean;
exports.build = gulp.series(clean, build);
exports.test = gulp.series(build, test);
