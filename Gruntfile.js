module.exports = function (grunt) {

    var path = require('path');
    var cp = require('child_process');
    var Q = require('q');
    var Builder = require('systemjs-builder');

    // Project configuration.
    grunt.initConfig({

        // Access the package file contents for later use.
        pkg: grunt.file.readJSON('package.json'),

        // Task configuration.
        clean: {
            src: ['test/amd', 'amd', 'dist', 'documentation', 'system', '.tscache']
        },

        exec: {
            'test': {
                command: 'npm test',
                stdout: true,
                stderr: true
            }
        },

        requirejs: {
            compile: {
                options: {
                    mainConfigFile: "requirejs.config.js",
                    paths: {
                    }
                }
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            amd: {
                src: 'dist/davinci-mathscript.js',
                dest: 'dist/davinci-mathscript.min.js'
            },
            system: {
                src: 'dist/davinci-mathscript-system-es5.js',
                dest: 'dist/davinci-mathscript-system-es5.min.js'
            }
        },

        copy: {
            main: {
                expand: true,
                cwd: 'src/modules/',
                src: ['davinci-mathscript.d.ts'],
                dest: 'dist/'
            },
            all: {
                files: [
                    {
                        src: 'tsconfig.all.json',
                        dest: 'tsconfig.json'
                    }
                ]
            },
            docs: {
                files: [
                    {
                        src: 'tsconfig.docs.json',
                        dest: 'tsconfig.json'
                    }
                ]
            },
        },

        connect: {
            test: {
                options: {
                    port: 8000
                }
            }
        },

        jasmine: {
            taskName: {
                src: 'test/amd/**/*.js',
                options: {
                    specs: 'test/amd/**/*_test.js',
                    host: 'http://127.0.0.1:8000/',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfigFile: 'requirejs.config.js'
                    }
                }
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },

        ts: {
            amdES5: {
                tsconfig: {
                    tsconfig: './tsconfig.amd.json',
                    ignoreFiles: true,
                    ignoreSettings: true
                },
                options: {
                    fast: 'never',
                    module: 'amd',
                    target: 'ES5',
                    moduleResolution: "classic",
                    noImplicitAny: false,
                    noImplicitReturns: false,
                    noImplicitThis: false,
                    noUnusedLocals: false,
                    noUnusedParameters: false,
                    strictNullChecks: false,
                    suppressImplicitAnyIndexErrors: true,
                    outDir: 'amd',
                    sourceMap: false,
                    verbose: false
                }
            },
            testAMD: {
                tsconfig: {
                    tsconfig: './tsconfig.json',
                    ignoreFiles: true,
                    ignoreSettings: true
                },
                options: {
                    fast: 'never',
                    module: 'amd',
                    target: 'ES5',
                    moduleResolution: "classic",
                    noImplicitAny: false,
                    noImplicitReturns: false,
                    noImplicitThis: false,
                    noUnusedLocals: false,
                    noUnusedParameters: false,
                    strictNullChecks: false,
                    suppressImplicitAnyIndexErrors: true,
                    outDir: 'temp/amd',
                    sourceMap: false,
                    verbose: false
                }
            },
            systemES5: {
                tsconfig: {
                    tsconfig: './tsconfig.system.json',
                    ignoreFiles: true,
                    ignoreSettings: true
                },
                options: {
                    fast: 'never',
                    module: 'system',
                    target: 'ES5',
                    noImplicitAny: false,
                    noImplicitReturns: false,
                    noImplicitThis: false,
                    noUnusedLocals: false,
                    noUnusedParameters: false,
                    strictNullChecks: false,
                    suppressImplicitAnyIndexErrors: true,
                    outDir: 'system',
                    sourceMap: false,
                    verbose: false
                }
            },
            test: {
                tsconfig: {
                    tsconfig: './tsconfig.json',
                    ignoreFiles: true,
                    ignoreSettings: true
                },
                options: {
                    fast: 'never',
                    module: 'system',
                    target: 'ES5',
                    moduleResolution: "classic",
                    noImplicitAny: false,
                    noImplicitReturns: false,
                    noImplicitThis: false,
                    noUnusedLocals: false,
                    noUnusedParameters: false,
                    strictNullChecks: false,
                    suppressImplicitAnyIndexErrors: false,
                    outDir: 'test-karma',
                    sourceMap: false,
                    verbose: false
                }
            }
        },

        tslint: {
            src: ["src/davinci-mathscript/**/*.ts"],
            options: {
                configuration: 'tslint.json'
            }
        },

        watch: {
            scripts: {
                files: ['src/davinci-mathscript/**/*.ts'],
                tasks: ['ts:test'],
                options: {
                    spawn: false
                }
            }
        },

        // Check JavaScript files for errors/warnings
        jshint: {
            src: [
                'Gruntfile.js',
                'amd/**/*.js',
                'cjs/**/*.js',
                'spec/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        typedoc: {
            build: {
                options: {
                    module: 'system',
                    target: 'ES5',
                    out: 'documentation/',
                    mode: 'file',
                    name: 'davinci-mathscript <%= pkg.version %>',
                    exclude: '**/*.spec.ts',
                    excludeExternals: false,
                    excludeNotExported: true,
                    excludePrivate: true,
                    hideGenerator: true
                },
                src: [
                    './src/davinci-mathscript/**/*.ts'
                ]
            }
        }
    });

    function tsc(tsfile, option) {
        var command = "node " + path.resolve(path.dirname(require.resolve("typescript")), "tsc ");
        var optArray = Object.keys(option || {}).reduce(function (res, key) {
            res.push(key);
            if (option[key]) {
                res.push(option[key]);
            }
            return res;
        }, []);

        return Q.Promise(function (resolve, reject) {
            var cmd = command + " " + tsfile + " " + optArray.join(" ");
            var childProcess = cp.exec(cmd, {});
            childProcess.stdout.on('data', function (d) { grunt.log.writeln(d); });
            childProcess.stderr.on('data', function (d) { grunt.log.error(d); });

            childProcess.on('exit', function (code) {
                if (code !== 0) {
                    reject();
                }
                resolve();
            });
        });
    }

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-tslint');
    grunt.loadNpmTasks('grunt-typedoc');

    /**
     * The function called by the task of the same name.
     * It takes the contents of the 'system' folder and creates a bundle in the dist folder.
     */
    function bundle() {
        // Set the baseURL and load the configuration file.
        var builder = new Builder('./system', './config.js');

        var options = {
            minify: false,
            mangle: true,
            sourceMaps: true,
            lowResSourceMaps: true
        };

        return builder.bundle('davinci-mathscript.js', 'dist/davinci-mathscript-system-es5.js', options);
    }

    //
    // 'bundle' is called as a step in the 'system' task.
    //
    grunt.registerTask('bundle', "Bundle into system modules", function () {
        var done = this.async();
        bundle()
            .then(function () {
                done(true);
            })
            .catch(function (err) {
                console.log(err);
                done(false);
            });
    });

    grunt.registerTask('test', ['karma']);

    grunt.registerTask('docs', ['clean', 'copy:docs', 'typedoc', 'copy:all']);

    //
    // Creates the bundle in the dist folder with the ES5 System.register(...) format.
    // tsconfig.system.json specifies the root file from which all others are included.
    // spec files are not included.
    //
    grunt.registerTask('system', ['ts:systemES5', 'bundle']);

    //
    // Creates the bundle in the dist folder with the AMD/universal format.
    // tsconfig.amd.json specifies the root file from which all others are included.
    // spec files are not included.
    //
    grunt.registerTask('amd', ['ts:amdES5', 'requirejs']);
    grunt.registerTask('dev', ['clean', 'amd', 'system', 'uglify', 'copy:main', 'copy:all']);
    grunt.registerTask('default', ['clean', 'amd', 'system', 'tslint', 'uglify', 'copy:main', 'copy:docs', 'typedoc', 'copy:all']);
};
