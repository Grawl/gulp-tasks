import gulp from 'gulp'
import gulp_sass from 'gulp-sass'
export default function sass_task(options) {
	console.log({options})
	return gulp.src(options.from)
		.pipe(gulp_sass())
		.pipe(gulp.dest(options.to))
}
