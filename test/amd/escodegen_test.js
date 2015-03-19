define([
    'davinci-mathscript/esprima',
    'davinci-mathscript/escodegen',
    'davinci-mathscript'
], function(
    esprima,
    escodegen,
    MathScript
) {
describe("escodegen", function() {
    it("parse", function() {
      var parsed = esprima.parse("23");
      var newCode = escodegen.generate(parsed);
      expect(newCode).toBe("23;");
    });
});

});
