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
      try {
        var sum = MathScript.add(a,b);
        expect(1).toBe(0);
      }
      catch(e) {
        expect(e.message).toBe("+ is not supported for the operands given.");
      }
    });
    it("add(Foo, Complex);", function() {
      var a = new Foo();
      var b = new Complex(2,3);
      var c = b.__radd__(a);
      try {
        var sum = MathScript.add(a,b);
        expect(1).toBe(0);
      }
      catch(e) {
        expect(e.message).toBe("+ is not supported for the operands given.");
      }
    });
});

});
