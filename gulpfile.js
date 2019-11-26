const gulp = require("gulp");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const typedoc = require("gulp-typedoc");
const jest = require("gulp-jest").default;
const merge = require("merge2");
const pkg = require("./package.json");

const docs = function () {
    return gulp
        .src([
            "src/**/*.ts",
            "!src/**/*.test.ts"
        ])
        .pipe(typedoc({
            esModuleInterop: true,
            module: "commonjs",
            target: "es5",
            out: "docs/",
            name: `${pkg.name}:${pkg.version}`
        }));
}; // close docs

const test = function() {
    return gulp.src("./src/").pipe(jest());
}; // close test

const build = gulp.series(test, function buildJS() {
    const tsPipe = tsProject.src().pipe(tsProject());

    return merge([
        tsPipe.dts.pipe(gulp.dest("dist")),
        tsPipe.js.pipe(gulp.dest("dist"))
    ]);
}); // close build

const watch = gulp.series(build, function watching() {
    gulp.watch("./src/**/*.ts", gulp.parallel(docs, build));
}); // close watch

exports.watch = watch;
exports.build = build;
exports.docs = docs;
exports.test = test;
exports.default = build;
