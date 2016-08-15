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

            Scalar.prototype.__eq__ = function(other) {
                throw new Error("__eq__ is not implemented.");
            }

            Scalar.prototype.__ne__ = function(other) {
                throw new Error("__ne__ is not implemented");
            }

            Scalar.prototype.__lt__ = function(other) {
                if (other instanceof Scalar) {
                    return this.s < other.s;
                }
                else {
                    return void 0;
                }
            }

            Scalar.prototype.__le__ = function(other) {
                if (other instanceof Scalar) {
                    return this.s <= other.s;
                }
                else {
                    return void 0;
                }
            }

            Scalar.prototype.__gt__ = function(other) {
                if (other instanceof Scalar) {
                    return this.s > other.s;
                }
                else {
                    return void 0;
                }
            }

            Scalar.prototype.__ge__ = function(other) {
                if (other instanceof Scalar) {
                    return this.s >= other.s;
                }
                else if (typeof other === 'number') {
                    return this.s >= other;
                }
                else {
                    return void 0;
                }
            }

            Scalar.prototype.__rge__ = function(lhs) {
                if (lhs instanceof Scalar) {
                    return lhs.s >= this.s;
                }
                else if (typeof lhs === 'number') {
                    return lhs >= this.s;
                }
                else {
                    return void 0;
                }
            }

            function Complex(x, y) {
                this.x = x;
                this.y = y;
            }

            Complex.prototype.toString = function() {
                return "(" + this.x + ", " + this.y + ")";
            };

            Complex.prototype.__add__ = function(other) {
                if (other instanceof Complex) {
                    return new Complex(this.x + other.x, this.y + other.y);
                }
                else if (typeof other === 'number') {
                    return new Complex(this.x + other, this.y);
                }
                else if (other instanceof Scalar) {
                    return new Complex(this.x + other.s, this.y);
                }
                else {
                    return;
                }
            }

            Complex.prototype.__radd__ = function(other) {
                if (typeof other === 'number') {
                    return new Complex(other + this.x, this.y);
                }
                else if (other instanceof Scalar) {
                    return new Complex(other.s + this.x, this.y);
                }
                else {
                    return;
                }
            }

            Complex.prototype.__sub__ = function(other) {
                if (other instanceof Complex) {
                    return new Complex(this.x - other.x, this.y - other.y);
                }
                else if (typeof other === 'number') {
                    return new Complex(this.x - other, this.y);
                }
                else if (other instanceof Scalar) {
                    return new Complex(this.x - other.s, this.y);
                }
                else {
                    return;
                }
            }

            Complex.prototype.__rsub__ = function(other) {
                if (typeof other === 'number') {
                    return new Complex(other - this.x, -this.y);
                }
                else if (other instanceof Scalar) {
                    return new Complex(other.s - this.x, -this.y);
                }
                else {
                    return;
                }
            }

            Complex.prototype.__mul__ = function(other) {
                if (other instanceof Complex) {
                    return new Complex(this.x * other.x - this.y * other.y, this.x * other.y + this.y * other.x);
                }
                else if (typeof other === 'number') {
                    return new Complex(this.x * other, this.y * other);
                }
                else if (other instanceof Scalar) {
                    return new Complex(this.x * other.s, this.y * other.s);
                }
                else {
                    return;
                }
            }

            Complex.prototype.__rmul__ = function(other) {
                if (typeof other === 'number') {
                    return new Complex(other * this.x, other * this.y);
                }
                else if (other instanceof Scalar) {
                    return new Complex(other.s * this.x, other.s * this.y);
                }
                else {
                    return;
                }
            }

            Complex.prototype.__eq__ = function(other) {
                if (other instanceof Complex) {
                    return this.x === other.x && this.y === other.y;
                }
                else if (typeof other === 'number') {
                    return this.x === other && this.y === 0;
                }
                else if (other instanceof Scalar) {
                    return this.x === other.s && this.y === 0;
                }
                else {
                    return;
                }
            }

            Complex.prototype.__ne__ = function(other) {
                if (other instanceof Complex) {
                    return this.x !== other.x || this.y !== other.y;
                }
                else if (typeof other === 'number') {
                    return this.x !== other || this.y !== 0;
                }
                else if (other instanceof Scalar) {
                    return this.x !== other.s || this.y !== 0;
                }
                else {
                    return;
                }
            }

            Complex.prototype.__pos__ = function() {
                return this;
            }

            Complex.prototype.__neg__ = function() {
                return new Complex(-this.x, -this.y);
            }

            Complex.prototype.__tilde__ = function() {
                return new Complex(this.x, -this.y);
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

                describe("ConditionalExpression", function() {
                    it("", function() {
                        var code = MathScript.transpile("hex.length === 1 ? '0' + hex : '' + hex;");
                        expect(stripWS(code)).toBe("Ms.eq(hex.length, 1) ? Ms.add('0', hex) : Ms.add('', hex);");
                    });
                });

                describe("ForInStatement", function() {
                    it("", function() {
                        var code = MathScript.transpile("for (var x in a + b) {x + y}");
                        expect(stripWS(code)).toBe("for (var x in Ms.add(a, b)) {Ms.add(x, y); }");
                    });
                });

                describe("ForStatement", function() {
                    it("Basic", function() {
                        var src = "for (var x=0; x<10;x++) {z=x+1}"
                        var program = MathScript.parse(src);
                        expect(program.type).toBe("Program");
                        expect(program.body[0].type).toBe("ForStatement");
                        var code = MathScript.transpile(src);
                        expect(stripWS(code)).toBe("for (var x = 0; Ms.lt(x, 10); x++) {z = Ms.add(x, 1); }");
                    });
                });

                describe("LogicalExpression", function() {
                    it("eq", function() {
                        var code = MathScript.transpile("a === b");
                        expect(stripWS(code)).toBe("Ms.eq(a, b);");
                    });
                    it("ne", function() {
                        var code = MathScript.transpile("a !== b");
                        expect(stripWS(code)).toBe("Ms.ne(a, b);");
                    });
                    it("lt", function() {
                        var code = MathScript.transpile("a < b;");
                        expect(stripWS(code)).toBe("Ms.lt(a, b);");
                    });
                    it("le", function() {
                        var code = MathScript.transpile("a <= b;");
                        expect(stripWS(code)).toBe("Ms.le(a, b);");
                    });
                    it("gt", function() {
                        var code = MathScript.transpile("a > b;");
                        expect(stripWS(code)).toBe("Ms.gt(a, b);");
                    });
                    it("ge", function() {
                        var code = MathScript.transpile("a >= b;");
                        expect(stripWS(code)).toBe("Ms.ge(a, b);");
                    });
                    it("const x = (p/q) < (a|b);", function() {
                        var code = MathScript.transpile("const x = (p/q) < (a|b);");
                        expect(stripWS(code)).toBe("const x = Ms.lt(Ms.div(p, q), Ms.vbar(a, b));");
                    });
                });

                describe("Precedence", function() {
                    it("a << b ^ c", function() {
                        var code = MathScript.transpile("a << b ^ c");
                        expect(code).toBe("Ms.wedge(Ms.lshift(a, b), c);");
                    });
                    it("a ^ b << c", function() {
                        var code = MathScript.transpile("a ^ b << c");
                        expect(code).toBe("Ms.wedge(a, Ms.lshift(b, c));");
                    });

                    it("a >> b ^ c", function() {
                        var code = MathScript.transpile("a >> b ^ c");
                        expect(code).toBe("Ms.wedge(Ms.rshift(a, b), c);");
                    });
                    it("a ^ b >> c", function() {
                        var code = MathScript.transpile("a ^ b >> c");
                        expect(code).toBe("Ms.wedge(a, Ms.rshift(b, c));");
                    });

                    it("a | b ^ c", function() {
                        var code = MathScript.transpile("a | b ^ c");
                        expect(code).toBe("Ms.wedge(Ms.vbar(a, b), c);");
                    });
                    it("a ^ b | c", function() {
                        var code = MathScript.transpile("a ^ b | c");
                        expect(code).toBe("Ms.wedge(a, Ms.vbar(b, c));");
                    });

                    it("a ^ b * c", function() {
                        var code = MathScript.transpile("a ^ b * c");
                        expect(code).toBe("Ms.mul(Ms.wedge(a, b), c);");
                    });
                    it("a * b ^ c", function() {
                        var code = MathScript.transpile("a * b ^ c");
                        expect(code).toBe("Ms.mul(a, Ms.wedge(b, c));");
                    });

                    it("a * b + c", function() {
                        var code = MathScript.transpile("a * b + c");
                        expect(code).toBe("Ms.add(Ms.mul(a, b), c);");
                    });
                    it("a + b * c", function() {
                        var code = MathScript.transpile("a + b * c");
                        expect(code).toBe("Ms.add(a, Ms.mul(b, c));");
                    });
                });

                describe("BreakStatement", function() {
                    it("should be preserved", function() {
                        var sourceCode = "switch (x) { case 1: {}break; }";
                        var code = MathScript.transpile(sourceCode);
                        expect(stripWS(code)).toBe(sourceCode);
                    });
                });

                describe("CallExpression", function() {
                    it("should transpile its arguments", function() {
                        var code = MathScript.transpile("f(2+3)");
                        expect(code).toBe("f(Ms.add(2, 3));");
                    });
                });

                it("EmptyStatement ';;'", function() {
                    var code = MathScript.transpile("; ;");
                    expect(stripWS(code)).toBe("; ;");
                });

                it("IfStatement", function() {
                    var code = MathScript.transpile("if (1+2)\n    2+3\nelse\n    3+4");
                    expect(stripWS(code)).toBe("if (Ms.add(1, 2))Ms.add(2, 3); elseMs.add(3, 4);");
                });

                it("FunctionDeclaration", function() {
                    var code = MathScript.transpile("function f(x) {return x + 1;}");
                    expect(stripWS(code)).toBe("function f(x) {return Ms.add(x, 1); }");
                });
                it("Property", function() {
                    var code = MathScript.transpile("var x = {expr: function(){var c = a + b}};");
                    expect(stripWS(code)).toBe("var x = {expr: function () {var c = Ms.add(a, b);} };");
                });
                it("ThisExpression", function() {
                    var code = MathScript.transpile("(function() {var x;x=new Foo();z=x+y;}.call(this));");
                    expect(stripWS(code)).toBe("(function () {var x;x = new Foo();z = Ms.add(x, y); }.call(this));");
                });
                it("SwitchStatement", function() {
                    var code = MathScript.transpile("switch (a+b) {case p+q: {r+s} default: {x+y}}");
                    expect(stripWS(code)).toBe("switch (Ms.add(a, b)) { case Ms.add(p, q): {Ms.add(r, s);} default: {Ms.add(x, y);} }");
                });
                it("ThrowStatement", function() {
                    var code = MathScript.transpile("throw new Error(a + b);");
                    expect(stripWS(code)).toBe("throw new Error(Ms.add(a, b));");
                });
                it("TryStatement (1)", function() {
                    var code = MathScript.transpile("try {var a=b+c;} catch (e) { }");
                    expect(stripWS(code)).toBe("try {var a = Ms.add(b, c); } catch (e) { }");
                });
                it("TryStatement (2)", function() {
                    var code = MathScript.transpile("try { } catch (e) {var x=y+z;}");
                    expect(stripWS(code)).toBe("try { } catch (e) {var x = Ms.add(y, z); }");
                });
                it("TryStatement (3)", function() {
                    var code = MathScript.transpile("try {} catch (e) { } finally {var a=b+c;}");
                    expect(stripWS(code)).toBe("try { } catch (e) { } finally {var a = Ms.add(b, c); }");
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
                it("WhileStatement", function() {
                    var code = MathScript.transpile("while (a + b) {z = x * y; }");
                    expect(stripWS(code)).toBe("while (Ms.add(a, b)) {z = Ms.mul(x, y); }");
                });
            });

            describe("Runtime", function() {
                describe("add", function() {
                    it("add(number,number);", function() {
                        var a = 2;
                        var b = 3;
                        var sum = MathScript.add(a, b);
                        expect(sum).toBe(a + b);
                    });
                    it("add(Complex,Complex);", function() {
                        var a = new Complex(2, 3);
                        var b = new Complex(5, 7);
                        var c = a.__add__(b);
                        var sum = MathScript.add(a, b);
                        expect(c.x).toBe(7);
                        expect(c.y).toBe(10);
                        expect(sum.x).toBe(c.x);
                        expect(sum.y).toBe(c.y);
                    });
                    it("add(Complex,number);", function() {
                        var a = new Complex(2, 3);
                        var b = 5;
                        var c = a.__add__(b);
                        var sum = MathScript.add(a, b);
                        expect(c.x).toBe(7);
                        expect(c.y).toBe(3);
                        expect(sum.x).toBe(c.x);
                        expect(sum.y).toBe(c.y);
                    });
                    it("add(number, Complex);", function() {
                        var a = 5;
                        var b = new Complex(2, 3);
                        var c = b.__radd__(a);
                        var sum = MathScript.add(a, b);
                        expect(c.x).toBe(7);
                        expect(c.y).toBe(3);
                        expect(sum.x).toBe(c.x);
                        expect(sum.y).toBe(c.y);
                    });
                    it("add(Complex,Scalar);", function() {
                        var a = new Complex(2, 3);
                        var b = new Scalar(5);
                        var c = a.__add__(b);
                        var sum = MathScript.add(a, b);
                        expect(c.x).toBe(7);
                        expect(c.y).toBe(3);
                        expect(sum.x).toBe(c.x);
                        expect(sum.y).toBe(c.y);
                    });
                    it("add(Scalar,Complex);", function() {
                        var a = new Scalar(5);
                        var b = new Complex(2, 3);
                        var c = b.__radd__(a);
                        var sum = MathScript.add(a, b);
                        expect(c.x).toBe(7);
                        expect(c.y).toBe(3);
                        expect(sum.x).toBe(c.x);
                        expect(sum.y).toBe(c.y);
                    });
                    it("add(Complex,Foo);", function() {
                        var a = new Complex(2, 3);
                        var b = new Foo();
                        var c = a.__add__(b);
                        var sum = MathScript.add(a, b);
                        expect(sum).toBe("(2, 3)[object Object]");
                    });
                    it("add(Foo, Complex);", function() {
                        var a = new Foo();
                        var b = new Complex(2, 3);
                        var c = b.__radd__(a);
                        var sum = MathScript.add(a, b);
                        expect(sum).toBe("[object Object](2, 3)");
                    });
                    it("add(Foo, Foo);", function() {
                        var a = new Foo();
                        var b = new Foo();
                        var sum = MathScript.add(a, b);
                        expect(sum).toBe("[object Object][object Object]");
                    });
                    it("add(string,string);", function() {
                        var a = "Hello, ";
                        var b = "World!";
                        var sum = MathScript.add(a, b);
                        expect(sum).toBe("Hello, World!");
                    });
                });
                describe("sub", function() {
                    it("sub(number,number);", function() {
                        var diff = MathScript.sub(2, 3);
                        expect(diff).toBe(-1);
                    });
                    it("sub(Complex,Complex);", function() {
                        var a = new Complex(2, 3);
                        var b = new Complex(5, 7);
                        var c = a.__sub__(b);
                        var d = MathScript.sub(a, b);
                        expect(c.x).toBe(-3);
                        expect(c.y).toBe(-4);
                        expect(d.x).toBe(c.x);
                        expect(d.y).toBe(c.y);
                    });
                    it("sub(Complex,number);", function() {
                        var a = new Complex(2, 3);
                        var b = 5;
                        var c = a.__sub__(b);
                        var d = MathScript.sub(a, b);
                        expect(c.x).toBe(-3);
                        expect(c.y).toBe(3);
                        expect(d.x).toBe(c.x);
                        expect(d.y).toBe(c.y);
                    });
                    it("sub(number, Complex);", function() {
                        var a = 5;
                        var b = new Complex(2, 3);
                        var c = b.__rsub__(a);
                        var d = MathScript.sub(a, b);
                        expect(c.x).toBe(3);
                        expect(c.y).toBe(-3);
                        expect(d.x).toBe(c.x);
                        expect(d.y).toBe(c.y);
                    });
                    it("sub(Complex,Scalar);", function() {
                        var a = new Complex(2, 3);
                        var b = new Scalar(5);
                        var c = a.__sub__(b);
                        var d = MathScript.sub(a, b);
                        expect(c.x).toBe(-3);
                        expect(c.y).toBe(3);
                        expect(d.x).toBe(c.x);
                        expect(d.y).toBe(c.y);
                    });
                    it("sub(Scalar,Complex);", function() {
                        var a = new Scalar(5);
                        var b = new Complex(2, 3);
                        var c = b.__rsub__(a);
                        var d = MathScript.sub(a, b);
                        expect(c.x).toBe(3);
                        expect(c.y).toBe(-3);
                        expect(d.x).toBe(c.x);
                        expect(d.y).toBe(c.y);
                    });
                    it("sub(Complex,Foo);", function() {
                        var a = new Complex(2, 3);
                        var b = new Foo();
                        var c = a.__sub__(b);
                        var d = MathScript.sub(a, b);
                        expect(isNaN(d)).toBe(true);
                    });
                    it("sub(Foo, Complex);", function() {
                        var a = new Foo();
                        var b = new Complex(2, 3);
                        var c = b.__rsub__(a);
                        var d = MathScript.sub(a, b);
                        expect(isNaN(d)).toBe(true);
                    });
                    it("sub(Foo, Foo);", function() {
                        var a = new Foo();
                        var b = new Foo();
                        var c = MathScript.sub(a, b);
                        expect(isNaN(c)).toBe(true);
                    });
                    it("sub(string,string);", function() {
                        var a = "Hello, ";
                        var b = "World!";
                        var d = MathScript.sub(a, b);
                        expect(isNaN(d)).toBe(true);
                    });
                });

                describe("mul", function() {
                    it("mul(number,number);", function() {
                        expect(MathScript.mul(2, 3)).toBe(6);
                    });
                    it("mul(Complex,Complex);", function() {
                        var a = new Complex(2, 3);
                        var b = new Complex(5, 7);
                        var c = a.__mul__(b);
                        var d = MathScript.mul(a, b);
                        expect(c.x).toBe(-11);
                        expect(c.y).toBe(29);
                        expect(d.x).toBe(c.x);
                        expect(d.y).toBe(c.y);
                    });
                    it("mul(Complex,number);", function() {
                        var a = new Complex(2, 3);
                        var b = 5;
                        var c = a.__mul__(b);
                        var d = MathScript.mul(a, b);
                        expect(c.x).toBe(10);
                        expect(c.y).toBe(15);
                        expect(d.x).toBe(c.x);
                        expect(d.y).toBe(c.y);
                    });
                    it("mul(number, Complex);", function() {
                        var a = 5;
                        var b = new Complex(2, 3);
                        var c = b.__rmul__(a);
                        var d = MathScript.mul(a, b);
                        expect(c.x).toBe(10);
                        expect(c.y).toBe(15);
                        expect(d.x).toBe(c.x);
                        expect(d.y).toBe(c.y);
                    });
                    it("mul(Complex,Scalar);", function() {
                        var a = new Complex(2, 3);
                        var b = new Scalar(5);
                        var c = a.__mul__(b);
                        var d = MathScript.mul(a, b);
                        expect(c.x).toBe(10);
                        expect(c.y).toBe(15);
                        expect(d.x).toBe(c.x);
                        expect(d.y).toBe(c.y);
                    });
                    it("mul(Scalar,Complex);", function() {
                        var a = new Scalar(5);
                        var b = new Complex(2, 3);
                        var c = b.__rmul__(a);
                        var d = MathScript.mul(a, b);
                        expect(c.x).toBe(10);
                        expect(c.y).toBe(15);
                        expect(d.x).toBe(c.x);
                        expect(d.y).toBe(c.y);
                    });
                    it("mul(Complex,Foo);", function() {
                        var a = new Complex(2, 3);
                        var b = new Foo();
                        var c = a.__mul__(b);
                        var d = MathScript.mul(a, b);
                        expect(isNaN(d)).toBe(true);
                    });
                    it("mul(Foo, Complex);", function() {
                        var a = new Foo();
                        var b = new Complex(2, 3);
                        var c = b.__rmul__(a);
                        var d = MathScript.mul(a, b);
                        expect(isNaN(d)).toBe(true);
                    });
                    it("mul(Foo, Foo);", function() {
                        var a = new Foo();
                        var b = new Foo();
                        var c = MathScript.mul(a, b);
                        expect(isNaN(c)).toBe(true);
                    });
                    it("mul(string,string);", function() {
                        var a = "Hello, ";
                        var b = "World!";
                        var c = MathScript.mul(a, b);
                        expect(isNaN(c)).toBe(true);
                    });
                });

                describe("div", function() {
                    it("div(number,number);", function() {
                        expect(MathScript.div(6, 2)).toBe(3);
                    });
                    it("mul(Complex,Complex);", function() {
                        var a = new Complex(2, 3);
                        var b = new Complex(5, 7);
                        var c = a.__mul__(b);
                        var d = MathScript.mul(a, b);
                        expect(c.x).toBe(-11);
                        expect(c.y).toBe(29);
                        expect(d.x).toBe(c.x);
                        expect(d.y).toBe(c.y);
                    });
                    it("mul(Complex,number);", function() {
                        var a = new Complex(2, 3);
                        var b = 5;
                        var c = a.__mul__(b);
                        var d = MathScript.mul(a, b);
                        expect(c.x).toBe(10);
                        expect(c.y).toBe(15);
                        expect(d.x).toBe(c.x);
                        expect(d.y).toBe(c.y);
                    });
                    it("mul(number, Complex);", function() {
                        var a = 5;
                        var b = new Complex(2, 3);
                        var c = b.__rmul__(a);
                        var d = MathScript.mul(a, b);
                        expect(c.x).toBe(10);
                        expect(c.y).toBe(15);
                        expect(d.x).toBe(c.x);
                        expect(d.y).toBe(c.y);
                    });
                    it("mul(Complex,Scalar);", function() {
                        var a = new Complex(2, 3);
                        var b = new Scalar(5);
                        var c = a.__mul__(b);
                        var d = MathScript.mul(a, b);
                        expect(c.x).toBe(10);
                        expect(c.y).toBe(15);
                        expect(d.x).toBe(c.x);
                        expect(d.y).toBe(c.y);
                    });
                    it("mul(Scalar,Complex);", function() {
                        var a = new Scalar(5);
                        var b = new Complex(2, 3);
                        var c = b.__rmul__(a);
                        var d = MathScript.mul(a, b);
                        expect(c.x).toBe(10);
                        expect(c.y).toBe(15);
                        expect(d.x).toBe(c.x);
                        expect(d.y).toBe(c.y);
                    });
                    it("mul(Complex,Foo);", function() {
                        var a = new Complex(2, 3);
                        var b = new Foo();
                        var c = a.__mul__(b);
                        var d = MathScript.mul(a, b);
                        expect(isNaN(d)).toBe(true);
                    });
                    it("mul(Foo, Complex);", function() {
                        var a = new Foo();
                        var b = new Complex(2, 3);
                        var c = b.__rmul__(a);
                        var d = MathScript.mul(a, b);
                        expect(isNaN(d)).toBe(true);
                    });
                    it("mul(Foo, Foo);", function() {
                        var a = new Foo();
                        var b = new Foo();
                        var c = MathScript.mul(a, b);
                        expect(isNaN(c)).toBe(true);
                    });
                    it("mul(string,string);", function() {
                        var a = "Hello, ";
                        var b = "World!";
                        var c = MathScript.mul(a, b);
                        expect(isNaN(c)).toBe(true);
                    });
                });

                describe("eq", function() {
                    it("eq(number,number);", function() {
                        var a = 2;
                        var b = 3;
                        var sum = MathScript.eq(a, b);
                        expect(sum).toBe(a === b);
                    });
                    it("eq(undefined,number);", function() {
                        var a = undefined;
                        var b = 3;
                        var sum = MathScript.eq(a, b);
                        expect(sum).toBe(a === b);
                    });
                    it("eq(number, undefined);", function() {
                        var a = 2;
                        var b = undefined;
                        var sum = MathScript.eq(a, b);
                        expect(sum).toBe(a === b);
                    });
                    it("eq(Complex,Complex);", function() {
                        var a = new Complex(2, 3);
                        var b = new Complex(5, 7);
                        var c = a.__eq__(b);
                        var same = MathScript.eq(a, b);
                        expect(c).toBe(false);
                        expect(same).toBe(false);
                    });
                    it("eq(Complex,undefined);", function() {
                        var a = new Complex(2, 3);
                        var b = undefined;
                        var c = a.__eq__(b);
                        var same = MathScript.eq(a, b);
                        expect(c).toBe(undefined);
                        expect(same).toBe(false);
                    });
                });

                describe("ne", function() {
                    it("ne(number,number);", function() {
                        var a = 2;
                        var b = 3;
                        var sum = MathScript.ne(a, b);
                        expect(sum).toBe(a !== b);
                    });
                    it("ne(undefined,number);", function() {
                        var a = undefined;
                        var b = 3;
                        var sum = MathScript.ne(a, b);
                        expect(sum).toBe(a !== b);
                    });
                    it("ne(number, undefined);", function() {
                        var a = 2;
                        var b = undefined;
                        var sum = MathScript.ne(a, b);
                        expect(sum).toBe(a !== b);
                    });
                    it("ne(null,number);", function() {
                        var a = null;
                        var b = 3;
                        var sum = MathScript.ne(a, b);
                        expect(sum).toBe(a !== b);
                    });
                    it("ne(number, null);", function() {
                        var a = 2;
                        var b = null;
                        var sum = MathScript.ne(a, b);
                        expect(sum).toBe(a !== b);
                    });
                    it("ne(Complex,Complex);", function() {
                        var a = new Complex(2, 3);
                        var b = new Complex(5, 7);
                        var c = a.__ne__(b);
                        var diff = MathScript.ne(a, b);
                        expect(c).toBe(true);
                        expect(diff).toBe(true);
                    });
                    it("ne(Complex,undefined);", function() {
                        var a = new Complex(2, 3);
                        var b = undefined;
                        var c = a.__ne__(b);
                        var diff = MathScript.ne(a, b);
                        expect(c).toBe(undefined);
                        expect(diff).toBe(true);
                    });
                });

                describe("ge", function() {
                    it("ge(number,number);", function() {
                        expect(MathScript.ge(2, 3)).toBe(false);
                        expect(MathScript.ge(3, 3)).toBe(true);
                        expect(MathScript.ge(4, 3)).toBe(true);
                    });
                    it("ge(undefined,number);", function() {
                        var a = undefined;
                        var b = 3;
                        var sum = MathScript.ge(a, b);
                        expect(sum).toBe(a >= b);
                    });
                    it("ge(number, undefined);", function() {
                        var a = 2;
                        var b = undefined;
                        var sum = MathScript.ge(a, b);
                        expect(sum).toBe(a >= b);
                    });
                    it("ge(null,number);", function() {
                        var a = null;
                        var b = 3;
                        var sum = MathScript.ge(a, b);
                        expect(sum).toBe(a >= b);
                    });
                    it("ge(number, null);", function() {
                        var a = 2;
                        var b = null;
                        var sum = MathScript.ge(a, b);
                        expect(sum).toBe(a >= b);
                    });
                    it("ge(Scalar(2),Scalar(3));", function() {
                        var a = new Scalar(2);
                        var b = new Scalar(3);
                        var c = a.__ge__(b);
                        var diff = MathScript.ge(a, b);
                        expect(c).toBe(false);
                        expect(diff).toBe(false);
                    });
                    it("ge(Scalar(3),Scalar(3));", function() {
                        var a = new Scalar(3);
                        var b = new Scalar(3);
                        var c = a.__ge__(b);
                        var diff = MathScript.ge(a, b);
                        expect(c).toBe(true);
                        expect(diff).toBe(true);
                    });
                    it("ge(Scalar,undefined);", function() {
                        var a = new Scalar(2);
                        var b = undefined;
                        var c = a.__ge__(b);
                        var diff = MathScript.ge(a, b);
                        expect(c).toBe(undefined);
                        expect(diff).toBe(2 >= undefined);
                    });
                    it("ge(Scalar(2),3);", function() {
                        var a = new Scalar(2);
                        var b = 3;
                        var c = a.__ge__(b);
                        var diff = MathScript.ge(a, b);
                        expect(c).toBe(false);
                        expect(diff).toBe(false);
                    });
                    it("ge(2, Scalar(3));", function() {
                        var a = 2;
                        var b = new Scalar(3);
                        var c = b.__rge__(a);
                        var diff = MathScript.ge(a, b);
                        expect(c).toBe(false);
                        expect(diff).toBe(false);
                    });
                });

                describe("gt", function() {
                    it("gt(number,number);", function() {
                        expect(MathScript.gt(2, 3)).toBe(false);
                        expect(MathScript.gt(3, 3)).toBe(false);
                        expect(MathScript.gt(4, 3)).toBe(true);
                    });
                    it("gt(undefined,number);", function() {
                        var a = undefined;
                        var b = 3;
                        var sum = MathScript.gt(a, b);
                        expect(sum).toBe(a > b);
                    });
                    it("gt(number, undefined);", function() {
                        var a = 2;
                        var b = undefined;
                        var sum = MathScript.gt(a, b);
                        expect(sum).toBe(a > b);
                    });
                    it("gt(null,number);", function() {
                        var a = null;
                        var b = 3;
                        var sum = MathScript.gt(a, b);
                        expect(sum).toBe(a > b);
                    });
                    it("gt(number, null);", function() {
                        var a = 2;
                        var b = null;
                        var sum = MathScript.gt(a, b);
                        expect(sum).toBe(a > b);
                    });
                    it("gt(Scalar(2),Scalar(3));", function() {
                        var a = new Scalar(2);
                        var b = new Scalar(3);
                        var c = a.__gt__(b);
                        var diff = MathScript.gt(a, b);
                        expect(c).toBe(false);
                        expect(diff).toBe(false);
                    });
                    it("gt(Scalar(3),Scalar(3));", function() {
                        var a = new Scalar(3);
                        var b = new Scalar(3);
                        var c = a.__gt__(b);
                        var diff = MathScript.gt(a, b);
                        expect(c).toBe(false);
                        expect(diff).toBe(false);
                    });
                    it("gt(Scalar(4),Scalar(3));", function() {
                        var a = new Scalar(4);
                        var b = new Scalar(3);
                        var c = a.__gt__(b);
                        var diff = MathScript.gt(a, b);
                        expect(c).toBe(true);
                        expect(diff).toBe(true);
                    });
                    it("gt(Scalar,undefined);", function() {
                        var a = new Scalar(2);
                        var b = undefined;
                        var c = a.__gt__(b);
                        var diff = MathScript.gt(a, b);
                        expect(c).toBe(undefined);
                        expect(diff).toBe(2 > undefined);
                    });
                });

                describe("le", function() {
                    it("le(number,number);", function() {
                        expect(MathScript.le(2, 3)).toBe(true);
                        expect(MathScript.le(3, 3)).toBe(true);
                        expect(MathScript.le(4, 3)).toBe(false);
                    });
                    it("le(undefined,number);", function() {
                        var a = undefined;
                        var b = 3;
                        var sum = MathScript.le(a, b);
                        expect(sum).toBe(a <= b);
                    });
                    it("le(number, undefined);", function() {
                        var a = 2;
                        var b = undefined;
                        var sum = MathScript.le(a, b);
                        expect(sum).toBe(a <= b);
                    });
                    it("le(null,number);", function() {
                        var a = null;
                        var b = 3;
                        var sum = MathScript.le(a, b);
                        expect(sum).toBe(a <= b);
                    });
                    it("le(number, null);", function() {
                        var a = 2;
                        var b = null;
                        var sum = MathScript.le(a, b);
                        expect(sum).toBe(a <= b);
                    });
                    it("le(Scalar(2),Scalar(3));", function() {
                        var a = new Scalar(2);
                        var b = new Scalar(3);
                        var c = a.__le__(b);
                        var diff = MathScript.le(a, b);
                        expect(c).toBe(true);
                        expect(diff).toBe(true);
                    });
                    it("le(Scalar(3),Scalar(3));", function() {
                        var a = new Scalar(3);
                        var b = new Scalar(3);
                        var c = a.__le__(b);
                        var diff = MathScript.le(a, b);
                        expect(c).toBe(true);
                        expect(diff).toBe(true);
                    });
                    it("le(Scalar(4),Scalar(3));", function() {
                        var a = new Scalar(4);
                        var b = new Scalar(3);
                        var c = a.__le__(b);
                        var diff = MathScript.le(a, b);
                        expect(c).toBe(false);
                        expect(diff).toBe(false);
                    });
                    it("le(Scalar,undefined);", function() {
                        var a = new Scalar(2);
                        var b = undefined;
                        var c = a.__le__(b);
                        var diff = MathScript.le(a, b);
                        expect(c).toBe(undefined);
                        expect(diff).toBe(2 <= undefined);
                    });
                });

                describe("lt", function() {
                    it("lt(number,number);", function() {
                        expect(MathScript.lt(2, 3)).toBe(true);
                        expect(MathScript.lt(3, 3)).toBe(false);
                        expect(MathScript.lt(4, 3)).toBe(false);
                    });
                    it("lt(undefined,number);", function() {
                        var a = undefined;
                        var b = 3;
                        var sum = MathScript.lt(a, b);
                        expect(sum).toBe(a < b);
                    });
                    it("lt(number, undefined);", function() {
                        var a = 2;
                        var b = undefined;
                        var sum = MathScript.lt(a, b);
                        expect(sum).toBe(a < b);
                    });
                    it("lt(null,number);", function() {
                        var a = null;
                        var b = 3;
                        var sum = MathScript.lt(a, b);
                        expect(sum).toBe(a < b);
                    });
                    it("lt(number, null);", function() {
                        var a = 2;
                        var b = null;
                        var sum = MathScript.lt(a, b);
                        expect(sum).toBe(a < b);
                    });
                    it("lt(Scalar(2),Scalar(3));", function() {
                        var a = new Scalar(2);
                        var b = new Scalar(3);
                        var c = a.__lt__(b);
                        var diff = MathScript.lt(a, b);
                        expect(c).toBe(true);
                        expect(diff).toBe(true);
                    });
                    it("lt(Scalar,undefined);", function() {
                        var a = new Scalar(2);
                        var b = undefined;
                        var c = a.__lt__(b);
                        var diff = MathScript.lt(a, b);
                        expect(c).toBe(undefined);
                        expect(diff).toBe(2 < undefined);
                    });
                });

                describe("neg", function() {
                    it("neg(number);", function() {
                        expect(MathScript.neg(2)).toBe(-2);
                    });
                    it("neg(undefined);", function() {
                        expect(MathScript.neg(undefined)).toBeNaN();
                    });
                    it("neg(Complex);", function() {
                        var z = new Complex(2, 3);
                        var q = z.__neg__();
                        expect(q.x).toBe(-2);
                        expect(q.y).toBe(-3);
                        expect(MathScript.neg(z).x).toBe(-2);
                        expect(MathScript.neg(z).y).toBe(-3);
                    });
                });

                describe("pos", function() {
                    it("pos(number);", function() {
                        expect(MathScript.pos(2)).toBe(2);
                    });
                    it("pos(undefined);", function() {
                        expect(MathScript.pos(undefined)).toBeNaN();
                    });
                    it("pos(Complex);", function() {
                        var z = new Complex(2, 3);
                        var q = z.__pos__();
                        expect(q.x).toBe(2);
                        expect(q.y).toBe(3);
                        expect(MathScript.pos(z).x).toBe(2);
                        expect(MathScript.pos(z).y).toBe(3);
                    });
                });

                describe("tilde", function() {
                    it("tilde(number);", function() {
                        expect(MathScript.pos(2)).toBe(2);
                    });
                    it("tilde(Complex);", function() {
                        var z = new Complex(2, 3);
                        var q = z.__tilde__();
                        expect(q.x).toBe(2);
                        expect(q.y).toBe(-3);
                        expect(MathScript.tilde(z).x).toBe(2);
                        expect(MathScript.tilde(z).y).toBe(-3);
                    });
                });

            });
        });

    });
