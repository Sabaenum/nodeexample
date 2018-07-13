module.export = function (grunt) {
    [
        "grunt-cafe-mocha",
        "grunt-contrib-jshint",
        "grunt-exec",
    ].forEach(function (task) {
        grunt.loadNpmTasks(task);
    });
    //config plugins
    grunt.initConfig({
        cafemocha:{
            all: { src: "/qa/tests-*.js", options: { ui: "tdd"} }
        },
        jshint:{
            app: ["meadowlark.js"],
            qa: ["Gruntfile.js", "/qa/*.js"],
        },
        exec:{
            linkchecker: {cmd: "linkchecker http://192.168.33.77:3000"}
        },
    });
    grunt.registerTask("default", ["cafemocha","jshint"]);
};
