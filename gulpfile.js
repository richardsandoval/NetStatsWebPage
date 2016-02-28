var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('default', function () {
  nodemon({
    script: 'app',
    ext: 'js',
    env: {
      PORT: 1337
    },
    ignore: ['./node_modules/**']
  }).on('restart', function () {
    console.log('Restarting');
  });
});
