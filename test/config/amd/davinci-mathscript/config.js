// test/config/amd/davinci-mathscript/config.js
// TODO: automate generation of this file.
require([
    'davinci-mathscript'
], function(){ require([
    'test/amd/escodegen_test.js',
    'test/amd/esprima_test.js',
    'test/amd/mathscript_test.js'
], function() {
    window.initializeJasmine();
});});