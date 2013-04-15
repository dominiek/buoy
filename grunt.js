module.exports = function(grunt) {
  
  // Project configuration.
  grunt.initConfig({
    clean: ['dist'],
    lint: {
      all: ['grunt.js', 'src/*.js']
    }
  });
  
  grunt.loadNpmTasks('grunt-bump');

};