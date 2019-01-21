const gulp = require("gulp");
const fs = require("fs");
const path = require("path");
const sass = require("gulp-sass");
const rename = require("gulp-rename");
const insert = require("gulp-insert");
const globImporter = require("node-sass-glob-importer");

const META = `/*//META{"name":"Nox","description":"A theme for Discord loosely based on Google's Material Design Guidelines.","author":"Lilian Tedone & Zerebos","version":"1.0.0"}*//**/

`;

const LICENSE = `/*
 *  Copyright (c) 2016-2017 Lilian Tedone, 2017-2019 Zack Rauen
 * 
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */

`;

const isDirectory = source => fs.lstatSync(source).isDirectory();
const getDirectories = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
const directories = getDirectories("./src").map(d => `./${d}/*.scss`.replace("\\", "/"));

const fileList = ["./src/index.css", "./src/*.scss", ...directories];

gulp.task("import", function () {
  return gulp.src("./src/index.scss")
    .pipe(sass({importer: globImporter()}).on("error", sass.logError))
    .pipe(rename({basename: "import", extname: ".css"}))
    .pipe(insert.prepend(LICENSE))
    .pipe(gulp.dest("./release/"));
});
 
gulp.task("sass", function () {
  return gulp.src("./src/index.scss")
    .pipe(sass({importer: globImporter()}).on("error", sass.logError))
    .pipe(rename({basename: "Nox.theme", extname: ".css"}))
    .pipe(insert.prepend(META + LICENSE))
    .pipe(gulp.dest("Z:/Programming/BetterDiscordStuff/themes"));
});

gulp.task("sass-watch", function() {
  return gulp.watch(fileList).on("all", gulp.series("sass"));
});