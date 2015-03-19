define([
    'davinci-mathscript'
], function(
    MathScript
) {
describe("MathScript", function() {
    it("transform", function() {
      var code = MathScript.transform("23");
      expect(code).toBe("23;");
    });
    it("a + b", function() {
      var code = MathScript.transform("a + b");
      expect(code).toBe("Ms.add(a, b);");
    });
    it("a << b", function() {
      var code = MathScript.transform("a << b");
      expect(code).toBe("Ms.lco(a, b);");
    });
    it("a << b * c", function() {
      var code = MathScript.transform("a << b * c");
      expect(code).toBe("Ms.mul(Ms.lco(a, b), c);");
    });
    it("a * b << c", function() {
      var code = MathScript.transform("a * b << c");
      expect(code).toBe("Ms.mul(a, Ms.lco(b, c));");
    });
});

});
