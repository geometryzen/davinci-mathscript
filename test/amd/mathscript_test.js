define([
    'davinci-mathscript'
], function(
    MathScript
) {
describe("MathScript", function() {

    function stripWS(s) {
      return s.replace(/\t/g, ' ').replace(/\n/g, ' ').replace(/(\s[\s]+)/g, '');
    }

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
        return new Complex(other+this.x, this.y);
      }
      else if (other instanceof Scalar) {
        return new Complex(other.s+this.x, this.y);
      }
      else {
        return;
      }
    }

    Complex.prototype.__sub__ = function(other) {
      if (other instanceof Complex) {
        return new Complex(this.x-other.x, this.y-other.y);
      }
      else if (typeof other === 'number') {
        return new Complex(this.x-other, this.y);
      }
      else if (other instanceof Scalar) {
        return new Complex(this.x-other.s, this.y);
      }
      else {
        return;
      }
    }

    Complex.prototype.__rsub__ = function(other) {
      if (typeof other === 'number') {
        return new Complex(other-this.x, -this.y);
      }
      else if (other instanceof Scalar) {
        return new Complex(other.s-this.x, -this.y);
      }
      else {
        return;
      }
    }

    Complex.prototype.__mul__ = function(other) {
      if (other instanceof Complex) {
        return new Complex(this.x*other.x-this.y*other.y, this.x*other.y+this.y*other.x);
      }
      else if (typeof other === 'number') {
        return new Complex(this.x*other, this.y*other);
      }
      else if (other instanceof Scalar) {
        return new Complex(this.x*other.s, this.y*other.s);
      }
      else {
        return;
      }
    }

    Complex.prototype.__rmul__ = function(other) {
      if (typeof other === 'number') {
        return new Complex(other*this.x, other*this.y);
      }
      else if (other instanceof Scalar) {
        return new Complex(other.s*this.x, other.s*this.y);
      }
      else {
        return;
      }
    }

    Complex.prototype.__neg__ = function() {
      return new Complex(-this.x, -this.y);
    }

    function Foo() {

    }

    describe("Transpile", function() {

      describe("Program", function() {
        it("Basic", function() {
          var src = "42;"
          var program = MathScript.parse(src);
          expect(program.type).toBe("Program");
          expect(program.body[0].type).toBe("ExpressionStatement");
          expect(program.body[0].expression.type).toBe("Literal");
          var code = MathScript.transpile(src);
          expect(code).toBe("42;");
        });
      });

      describe("ExpressionStatement", function() {
        describe("Literal", function() {
          it("number", function() {
            var src = "23;"
            var program = MathScript.parse(src);
            expect(program.type).toBe("Program");
            expect(program.body[0].type).toBe("ExpressionStatement");
            expect(program.body[0].expression.type).toBe("Literal");
            var code = MathScript.transpile(src);
            expect(code).toBe("23;");
          });
          it("string", function() {
            var src = "'Hello';"
            var program = MathScript.parse(src);
            expect(program.type).toBe("Program");
            expect(program.body[0].type).toBe("ExpressionStatement");
            expect(program.body[0].expression.type).toBe("Literal");
            var code = MathScript.transpile(src);
            expect(code).toBe("'Hello';");
          });
          it("boolean", function() {
            var src = "true;"
            var program = MathScript.parse(src);
            expect(program.type).toBe("Program");
            expect(program.body[0].type).toBe("ExpressionStatement");
            expect(program.body[0].expression.type).toBe("Literal");
            var code = MathScript.transpile(src);
            expect(code).toBe("true;");
          });
        });
      });

      describe("BinaryExpression", function() {
        it("+ Addition", function() {
          var code = MathScript.transpile("a + b");
          expect(stripWS(code)).toBe("Ms.add(a, b);");
        });
        it("- Subtraction", function() {
          var code = MathScript.transpile("a - b");
          expect(stripWS(code)).toBe("Ms.sub(a, b);");
        });
        it("* Multiplication", function() {
          var code = MathScript.transpile("a * b");
          expect(stripWS(code)).toBe("Ms.mul(a, b);");
        });
        it("/ Division", function() {
          var code = MathScript.transpile("a / b");
          expect(stripWS(code)).toBe("Ms.div(a, b);");
        });
        it("<< Left Shift", function() {
          var code = MathScript.transpile("a << b");
          expect(stripWS(code)).toBe("Ms.lshift(a, b);");
        });
        it(">> Right Shift", function() {
          var code = MathScript.transpile("a >> b");
          expect(stripWS(code)).toBe("Ms.rshift(a, b);");
        });
        it("^ Wedge", function() {
          var code = MathScript.transpile("a ^ b");
          expect(stripWS(code)).toBe("Ms.wedge(a, b);");
        });
      });

      describe("LogicalExpression", function() {
        it("eq", function() {
          var code = MathScript.transpile("a === b");
          expect(stripWS(code)).toBe("Ms.eq(a, b);");
        });
        it("ne", function() {
          var code = MathScript.transpile("a != b");
          expect(stripWS(code)).toBe("Ms.ne(a, b);");
        });
        it("lt", function() {
          var code = MathScript.transpile("a < b");
          expect(stripWS(code)).toBe("Ms.lt(a, b);");
        });
        it("le", function() {
          var code = MathScript.transpile("a <= b");
          expect(stripWS(code)).toBe("Ms.le(a, b);");
        });
        it("gt", function() {
          var code = MathScript.transpile("a > b");
          expect(stripWS(code)).toBe("Ms.gt(a, b);");
        });
        it("ge", function() {
          var code = MathScript.transpile("a >= b");
          expect(stripWS(code)).toBe("Ms.ge(a, b);");
        });
      });

      describe("Precedence", function() {
        it("a << b * c", function() {
          var code = MathScript.transpile("a << b * c");
          expect(code).toBe("Ms.mul(Ms.lshift(a, b), c);");
        });
        it("a * b << c", function() {
          var code = MathScript.transpile("a * b << c");
          expect(code).toBe("Ms.mul(a, Ms.lshift(b, c));");
        });
      });

      describe("CallExpression", function() {
        it("Arguments", function() {
          var code = MathScript.transpile("f(2+3)");
          expect(code).toBe("f(Ms.add(2, 3));");
        });
      });

      it("FunctionDeclaration", function() {
        var code = MathScript.transpile("function f(x) {return x + 1;}");
        expect(stripWS(code)).toBe("function f(x) {return Ms.add(x, 1); }");
      });
      it("ThisExpression", function() {
        var code = MathScript.transpile("(function() {var x;x=new Foo();z=x+y;}.call(this));");
        expect(stripWS(code)).toBe("(function () {var x;x = new Foo();z = Ms.add(x, y); }.call(this));");
      });
      it("ReturnStatement", function() {
        var code = stripWS(MathScript.transpile("function f(x) {return x + 1;}"));
        expect(stripWS(code)).toBe("function f(x) {return Ms.add(x, 1); }");
      });
      it("UnaryExpression '+'", function() {
        var code = MathScript.transpile("+1;");
        expect(stripWS(code)).toBe("Ms.pos(1);");
      });
      it("UnaryExpression '-'", function() {
        var code = MathScript.transpile("-1;");
        expect(stripWS(code)).toBe("Ms.neg(1);");
      });
      it("UnaryExpression '!'", function() {
        var code = MathScript.transpile("!1;");
        expect(stripWS(code)).toBe("Ms.bang(1);");
      });
      it("UnaryExpression '~'", function() {
        var code = MathScript.transpile("~1;");
        expect(stripWS(code)).toBe("Ms.tilde(1);");
      });
      it("VariableDeclaration", function() {
        var code = MathScript.transpile("var x = eight.vectorE3(1, 0, 0); var y = eight.vectorE3(0, 2, 0); console.log(x+y);");
        expect(stripWS(code)).toBe("var x = eight.vectorE3(1, 0, 0); var y = eight.vectorE3(0, 2, 0); console.log(Ms.add(x, y));");
      });
    });

    describe("Runtime", function() {
      describe("add", function() {
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
      });
      describe("sub", function() {
        it("sub(number,number);", function() {
          var diff = MathScript.sub(2,3);
          expect(diff).toBe(-1);
        });
        it("sub(Complex,Complex);", function() {
          var a = new Complex(2,3);
          var b = new Complex(5,7);
          var c = a.__sub__(b);
          var d = MathScript.sub(a,b);
          expect(c.x).toBe(-3);
          expect(c.y).toBe(-4);
          expect(d.x).toBe(c.x);
          expect(d.y).toBe(c.y);
        });
        it("sub(Complex,number);", function() {
          var a = new Complex(2,3);
          var b = 5;
          var c = a.__sub__(b);
          var d = MathScript.sub(a,b);
          expect(c.x).toBe(-3);
          expect(c.y).toBe(3);
          expect(d.x).toBe(c.x);
          expect(d.y).toBe(c.y);
        });
        it("sub(number, Complex);", function() {
          var a = 5;
          var b = new Complex(2,3);
          var c = b.__rsub__(a);
          var d = MathScript.sub(a,b);
          expect(c.x).toBe(3);
          expect(c.y).toBe(-3);
          expect(d.x).toBe(c.x);
          expect(d.y).toBe(c.y);
        });
        it("sub(Complex,Scalar);", function() {
          var a = new Complex(2,3);
          var b = new Scalar(5);
          var c = a.__sub__(b);
          var d = MathScript.sub(a,b);
          expect(c.x).toBe(-3);
          expect(c.y).toBe(3);
          expect(d.x).toBe(c.x);
          expect(d.y).toBe(c.y);
        });
        it("sub(Scalar,Complex);", function() {
          var a = new Scalar(5);
          var b = new Complex(2,3);
          var c = b.__rsub__(a);
          var d = MathScript.sub(a,b);
          expect(c.x).toBe(3);
          expect(c.y).toBe(-3);
          expect(d.x).toBe(c.x);
          expect(d.y).toBe(c.y);
        });
        it("sub(Complex,Foo);", function() {
          var a = new Complex(2,3);
          var b = new Foo();
          var c = a.__sub__(b);
          var d = MathScript.sub(a,b);
          expect(isNaN(d)).toBe(true);
        });
        it("sub(Foo, Complex);", function() {
          var a = new Foo();
          var b = new Complex(2,3);
          var c = b.__rsub__(a);
          var d = MathScript.sub(a,b);
          expect(isNaN(d)).toBe(true);
        });
        it("sub(Foo, Foo);", function() {
          var a = new Foo();
          var b = new Foo();
          var c = MathScript.sub(a,b);
          expect(isNaN(c)).toBe(true);
        });
        it("sub(string,string);", function() {
          var a = "Hello, ";
          var b = "World!";
          var d = MathScript.sub(a,b);
          expect(isNaN(d)).toBe(true);
        });
      });
      describe("mul", function() {
        it("mul(number,number);", function() {
          expect(MathScript.mul(2,3)).toBe(6);
        });
        it("mul(Complex,Complex);", function() {
          var a = new Complex(2,3);
          var b = new Complex(5,7);
          var c = a.__mul__(b);
          var d = MathScript.mul(a,b);
          expect(c.x).toBe(-11);
          expect(c.y).toBe(29);
          expect(d.x).toBe(c.x);
          expect(d.y).toBe(c.y);
        });
        it("mul(Complex,number);", function() {
          var a = new Complex(2,3);
          var b = 5;
          var c = a.__mul__(b);
          var d = MathScript.mul(a,b);
          expect(c.x).toBe(10);
          expect(c.y).toBe(15);
          expect(d.x).toBe(c.x);
          expect(d.y).toBe(c.y);
        });
        it("mul(number, Complex);", function() {
          var a = 5;
          var b = new Complex(2,3);
          var c = b.__rmul__(a);
          var d = MathScript.mul(a,b);
          expect(c.x).toBe(10);
          expect(c.y).toBe(15);
          expect(d.x).toBe(c.x);
          expect(d.y).toBe(c.y);
        });
        it("mul(Complex,Scalar);", function() {
          var a = new Complex(2,3);
          var b = new Scalar(5);
          var c = a.__mul__(b);
          var d = MathScript.mul(a,b);
          expect(c.x).toBe(10);
          expect(c.y).toBe(15);
          expect(d.x).toBe(c.x);
          expect(d.y).toBe(c.y);
        });
        it("mul(Scalar,Complex);", function() {
          var a = new Scalar(5);
          var b = new Complex(2,3);
          var c = b.__rmul__(a);
          var d = MathScript.mul(a,b);
          expect(c.x).toBe(10);
          expect(c.y).toBe(15);
          expect(d.x).toBe(c.x);
          expect(d.y).toBe(c.y);
        });
        it("mul(Complex,Foo);", function() {
          var a = new Complex(2,3);
          var b = new Foo();
          var c = a.__mul__(b);
          var d = MathScript.mul(a,b);
          expect(isNaN(d)).toBe(true);
        });
        it("mul(Foo, Complex);", function() {
          var a = new Foo();
          var b = new Complex(2,3);
          var c = b.__rmul__(a);
          var d = MathScript.mul(a,b);
          expect(isNaN(d)).toBe(true);
        });
        it("mul(Foo, Foo);", function() {
          var a = new Foo();
          var b = new Foo();
          var c = MathScript.mul(a,b);
          expect(isNaN(c)).toBe(true);
        });
        it("mul(string,string);", function() {
          var a = "Hello, ";
          var b = "World!";
          var c = MathScript.mul(a,b);
          expect(isNaN(c)).toBe(true);
        });
      });
      describe("div", function() {
        it("div(number,number);", function() {
          expect(MathScript.div(6,2)).toBe(3);
        });
        it("mul(Complex,Complex);", function() {
          var a = new Complex(2,3);
          var b = new Complex(5,7);
          var c = a.__mul__(b);
          var d = MathScript.mul(a,b);
          expect(c.x).toBe(-11);
          expect(c.y).toBe(29);
          expect(d.x).toBe(c.x);
          expect(d.y).toBe(c.y);
        });
        it("mul(Complex,number);", function() {
          var a = new Complex(2,3);
          var b = 5;
          var c = a.__mul__(b);
          var d = MathScript.mul(a,b);
          expect(c.x).toBe(10);
          expect(c.y).toBe(15);
          expect(d.x).toBe(c.x);
          expect(d.y).toBe(c.y);
        });
        it("mul(number, Complex);", function() {
          var a = 5;
          var b = new Complex(2,3);
          var c = b.__rmul__(a);
          var d = MathScript.mul(a,b);
          expect(c.x).toBe(10);
          expect(c.y).toBe(15);
          expect(d.x).toBe(c.x);
          expect(d.y).toBe(c.y);
        });
        it("mul(Complex,Scalar);", function() {
          var a = new Complex(2,3);
          var b = new Scalar(5);
          var c = a.__mul__(b);
          var d = MathScript.mul(a,b);
          expect(c.x).toBe(10);
          expect(c.y).toBe(15);
          expect(d.x).toBe(c.x);
          expect(d.y).toBe(c.y);
        });
        it("mul(Scalar,Complex);", function() {
          var a = new Scalar(5);
          var b = new Complex(2,3);
          var c = b.__rmul__(a);
          var d = MathScript.mul(a,b);
          expect(c.x).toBe(10);
          expect(c.y).toBe(15);
          expect(d.x).toBe(c.x);
          expect(d.y).toBe(c.y);
        });
        it("mul(Complex,Foo);", function() {
          var a = new Complex(2,3);
          var b = new Foo();
          var c = a.__mul__(b);
          var d = MathScript.mul(a,b);
          expect(isNaN(d)).toBe(true);
        });
        it("mul(Foo, Complex);", function() {
          var a = new Foo();
          var b = new Complex(2,3);
          var c = b.__rmul__(a);
          var d = MathScript.mul(a,b);
          expect(isNaN(d)).toBe(true);
        });
        it("mul(Foo, Foo);", function() {
          var a = new Foo();
          var b = new Foo();
          var c = MathScript.mul(a,b);
          expect(isNaN(c)).toBe(true);
        });
        it("mul(string,string);", function() {
          var a = "Hello, ";
          var b = "World!";
          var c = MathScript.mul(a,b);
          expect(isNaN(c)).toBe(true);
        });
      });
      describe("neg", function(){
        it("neg(number);", function() {
          expect(MathScript.neg(2)).toBe(-2);
        });
        it("neg(Complex);", function() {
          var z = new Complex(2,3);
          var q = z.__neg__();
          expect(q.x).toBe(-2);
          expect(q.y).toBe(-3);
          expect(MathScript.neg(z).x).toBe(-2);
          expect(MathScript.neg(z).y).toBe(-3);
        });
      });
    });
});

});
