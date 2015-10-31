/**
 * Created by rsandoval on 25/10/15.
 */

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('default', function () {
    nodemon({
        script: './bin/www',
        ext: 'js',
        env: {
            PORT: 8080

        },
        ignore: ['./node_modules/**']
    }).on('restart', function () {
        console.log('Restarting');
    });
});