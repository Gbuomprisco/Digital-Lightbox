module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            basic_and_extras: {
                files: {
                    'static/dist/js/tools_template.html': ['static/src/js/tools_template'],
                    'static/dist/js/lightbox.js': ['static/src/js/lightbox/lightbox.prefix', 'static/src/js/lightbox/*.js', 'static/src/js/lightbox/lightbox.suffix', 'static/src/js/search.js'],
                    'static/dist/js/lightbox-libs.js': ['static/src/js/libs/jquery-2.0.3.min.js', 'static/src/js/libs/jquery-ui-1.10.2.custom.min.js', 'static/src/js/libs/*.js', 'static/src/js/notifications.js'],
                    'static/dist/css/lightbox.css': ['static/src/css/libs/bootstrap.min.css', 'static/src/css/libs/bootflat.min.css', 'static/src/css/**/*.css', 'static/dist/css/lightbox-src.css']
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! lightbox <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'static/dist/js/lightbox.min.js': ['static/dist/js/lightbox.js'],
                    'static/dist/js/lightbox-libs.min.js': ['static/dist/js/lightbox-libs.js']
                }
            }
        },

        copy: {
            main: {
                files: [

                    {
                        cwd: 'static/src/css/',
                        flatten: true,
                        expand: true,
                        src: ['libs/jquery-ui-css/ui-lightness/images/*'],
                        dest: 'static/dist/css/images',
                    },

                    {
                        flatten: true,
                        expand: true,
                        cwd: 'static/src/css/',
                        src: ['libs/Jcrop.gif'],
                        dest: 'static/dist/css/',
                    },

                    // includes files within path and its sub-directories
                    {
                        flatten: true,
                        expand: true,
                        cwd: 'static/src/css/',
                        src: ['svg/*'],
                        dest: 'static/dist/css/svg/'
                    },

                ]
            }
        },

        less: {
            production: {
                options: {
                    compress: true,
                    cleancss: true,
                },
                files: {
                    "static/dist/css/lightbox-src.css": ["static/src/css/app.less"]
                }
            }
        },

        cssmin: {
            minify: {
                expand: true,
                cwd: 'static/dist/css/',
                src: ['lightbox.css'],
                dest: 'static/dist/css/',
                ext: '.min.css'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-copy');
    grunt.registerTask('default', ['less', 'concat', 'uglify', 'cssmin', 'copy']);

};