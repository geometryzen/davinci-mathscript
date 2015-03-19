define([
    'davinci-mathscript/esprima',
    'davinci-mathscript'
], function(
    esprima,
    MathScript
) {
describe("esprima", function() {
    it("parse", function() {
      var parsed = esprima.parse("23");
      expect(parsed.body[0].expression.value).toBe(23);
    });
});

});
