const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const nodemon = require('gulp-nodemon');

gulp.task('serve-html', function () {
	gulp.src('src-static/**/*.html').pipe(gulp.dest('public'));
});

gulp.task('serve-js', function () {
	gulp.src('src-static/**/*.js').pipe(sourcemaps.init()).pipe(concat('grubsoft.js')).pipe(sourcemaps.write()).pipe(gulp.dest('public/js'));
});

gulp.task('serve-css', function () {
	gulp.src('src-static/**/*.css').pipe(gulp.dest('public'));
});

gulp.task('build', ['serve-html', 'serve-css', 'serve-js']);

gulp.task('watch', function () {
	gulp.watch('src-static/**/*.html', ['serve-html']);
	gulp.watch('src-static/**/*.css', ['serve-css']);
	gulp.watch('src-static/**/*.js', ['serve-js']);
});

gulp.task('start-server', function () {
	const stream = nodemon({
		script: 'src-node/app.js'
	});

	stream.on('restart', function () {
		console.log('Reiniciando');
	});

	stream.on('crash', function () {
		console.error('Crashed');
		stream.emit('restart', 10);
	});
});

gulp.task('default', ['build', 'watch', 'start-server']);
