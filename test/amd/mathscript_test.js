define([
    'davinci-mathscript'
], function(
    MathScript
) {
describe("MathScript", function() {

    // Complex knows about Scalar, but Scalar does not know about Complex.
    function Scalar(s) {
      this.s = s;
    }

    Scalar.prototype.__add__ = function(other) {
      return;
    }

    function Complex(x,y) {
      this.x = x;
      this.y = y;
    }

    Complex.prototype.toString = function() {
      return "(" + this.x + ", " + this.y + ")";
    };

    Complex.prototype.__add__ = function(other) {
      if (other instanceof Complex) {
        return new Complex(this.x+other.x, this.y+other.y);
      }
      else if (typeof other === 'number') {
        return new Complex(this.x+other, this.y);
      }
      else if (other instanceof Scalar) {
        return new Complex(this.x+other.s, this.y);
      }
      else {
        return;
      }
    }

    Complex.prototype.__radd__ = function(other) {
      if (typeof other === 'number') {
        return new Complex(this.x+other, this.y);
      }
      else if (other instanceof Scalar) {
        return new Complex(this.x+other.s, this.y);
      }
      else {
        return;
      }
    }

    function Foo() {

    }

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
    it("console.log(1);", function() {
      var code = MathScript.transform("console.log(1)");
      expect(code).toBe("console.log(1);");
    });
    it("console.log(2+3);", function() {
      var code = MathScript.transform("console.log(2+3)");
      expect(code).toBe("console.log(Ms.add(2, 3));");
    });
    it("VariableDeclaration", function() {
      var code = MathScript.transform("var x = eight.vectorE3(1, 0, 0); var y = eight.vectorE3(0, 2, 0); console.log(x+y);");
      expect(code).toBe("var x = eight.vectorE3(1, 0, 0);\nvar y = eight.vectorE3(0, 2, 0);\nconsole.log(Ms.add(x, y));");
    });
    it("add(number,number);", function() {
      var sum = MathScript.add(2,3);
      expect(sum).toBe(5);
    });
    it("add(Complex,Complex);", function() {
      var a = new Complex(2,3);
      var b = new Complex(5,7);
      var c = a.__add__(b);
      var sum = MathScript.add(a,b);
      expect(c.x).toBe(7);
      expect(c.y).toBe(10);
      expect(sum.x).toBe(c.x);
      expect(sum.y).toBe(c.y);
    });
    it("add(Complex,number);", function() {
      var a = new Complex(2,3);
      var b = 5;
      var c = a.__add__(b);
      var sum = MathScript.add(a,b);
      expect(c.x).toBe(7);
      expect(c.y).toBe(3);
      expect(sum.x).toBe(c.x);
      expect(sum.y).toBe(c.y);
    });
    it("add(number, Complex);", function() {
      var a = 5;
      var b = new Complex(2,3);
      var c = b.__radd__(a);
      var sum = MathScript.add(a,b);
      expect(c.x).toBe(7);
      expect(c.y).toBe(3);
      expect(sum.x).toBe(c.x);
      expect(sum.y).toBe(c.y);
    });
    it("add(Complex,Scalar);", function() {
      var a = new Complex(2,3);
      var b = new Scalar(5);
      var c = a.__add__(b);
      var sum = MathScript.add(a,b);
      expect(c.x).toBe(7);
      expect(c.y).toBe(3);
      expect(sum.x).toBe(c.x);
      expect(sum.y).toBe(c.y);
    });
    it("add(Scalar,Complex);", function() {
      var a = new Scalar(5);
      var b = new Complex(2,3);
      var c = b.__radd__(a);
      var sum = MathScript.add(a,b);
      expect(c.x).toBe(7);
      expect(c.y).toBe(3);
      expect(sum.x).toBe(c.x);
      expect(sum.y).toBe(c.y);
    });
    it("add(Complex,Foo);", function() {
      var a = new Complex(2,3);
      var b = new Foo();
      var c = a.__add__(b);
      var sum = MathScript.add(a,b);
      expect(sum).toBe("(2, 3)[object Object]");
    });
    it("add(Foo, Complex);", function() {
      var a = new Foo();
      var b = new Complex(2,3);
      var c = b.__radd__(a);
      var sum = MathScript.add(a,b);
      expect(sum).toBe("[object Object](2, 3)");
    });
    it("add(Foo, Foo);", function() {
      var a = new Foo();
      var b = new Foo();
      var sum = MathScript.add(a,b);
      expect(sum).toBe("[object Object][object Object]");
    });
    it("add(string,string);", function() {
      var a = "Hello, ";
      var b = "World!";
      var sum = MathScript.add(a,b);
      expect(sum).toBe("Hello, World!");
    });

    describe("Syntax", function() {
      it("ThisExpression", function() {
        var code = MathScript.transform("(function() {2+3}.call(this));");
        expect(code).toBe("(function () {\n    Ms.add(2, 3);\n}.call(this));");
      });
      it("ThisExpression", function() {
        var code = MathScript.transform("(function() {var x;x=new Foo();z=x+y;}.call(this));");
        expect(code).toBe("(function () {\n    var x;\n    x = new Foo();\n    z = Ms.add(x, y);\n}.call(this));");
      });
    });
});

});
