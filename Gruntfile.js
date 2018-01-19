module.exports = function(grunt) {
    //noinspection JSUnresolvedFunction
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        copy: {
            default: {
                files: [
                    {
                        cwd: './src',
                        src: ['**/*'],
                        dest: './dist',
                        expand: true,
                        flatten: false
                    }
                ]
            },
            deploy: {
                files: [
                    {
                        cwd: './dist',
                        src: ['**/*', '!build.txt'],
                        dest: '../../deploy/web/idsSec360Viewer',
                        expand: true,
                        flattern: false
                    }
                ]
            },
            removeDistConfig: {
                cwd: './dist',
                src: ['main.js', 'lib/idsmap.js', 'lib/idsmap.min.js'],
                dest: './dist',
                expand: true,
                flatten: false,
                options: {
                    process: function(content) {
                        return content.replace(/_STARTHASHTAG([\s\S]*?)_ENDHASHTAG:1,/g, "");
                    }
                }
            },
            removeLibraryConfig: {
                cwd: './app',
                src: ['lib/idsmap.js', 'lib/idsmap.min.js'],
                dest: './app',
                expand: true,
                flatten: false,
                options: {
                    process: function(content) {
                        return content.replace(/_STARTHASHTAG([\s\S]*?)_ENDHASHTAG:1,/g, "");
                    }
                }
            },
            updateRequireAnchor: {
                src: "./dist/index.html",
                dest: "./dist/index.html",
                options: {
                    process: function(content) {
                        return content.replace(/src="lib\/require.js"/g, 'src="main.js"');
                    }
                }
            },
            updateLibraryExample: {
                src: "./dist/library_example.html",
                dest: "./dist/library_example.html",
                options: {
                    process: function(content) {
                        return content.replace(/src=".\/lib\/idsmap.js"/g, 'src="./lib/idsmap.min.js"');
                    }
                }
            }
        },
        replace: {},
        clean: {
            clearDist: {
                options: {
                    force: true
                },
                src: ['./dist/**/*']
            },
            clearDeploy: {
                options: {
                    force: true
                },
                src: ['../../deploy/web/idsSec360Viewer/**/*']
            }
        },
        uglify: {
            main: {
                options: {
                    preserveComments: false,
                    mangle: false,
                    max_line_length: 300,
                    no_mangle: true
                },
                expand: true,
                flatten: false,
                cwd: './dist',
                src: ['js/*.js'],
                dest: './dist'
            }
        },
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-purifycss');

    grunt.registerTask("deploySec360Viewer", [
        'buildSec360Viewer',
        'copyToDeploy'
    ]);

    grunt.registerTask("deploySec360ViewerDev", [
        'buildSec360ViewerDev',
        'copyToDeploy'
    ]);

    grunt.registerTask("copyToDeploy", [
        'clean:clearDeploy',
        'copy:deploy'
    ]);

    grunt.registerTask("buildSec360Viewer", [
        'clean:clearDist',
        'copy:default',
        'uglify:main',
        'postProcessDeployFiles'
    ]);

    grunt.registerTask("buildSec360ViewerDev", [
        'clean:clearDist',
        'copy:default',
        'postProcessDeployFiles'
    ]);

    grunt.registerTask('postProcessDeployFiles', [
        'copy:removeLibraryConfig',
        'copy:removeDistConfig',
        'copy:updateRequireAnchor',
        'copy:updateLibraryExample'
    ]);

};