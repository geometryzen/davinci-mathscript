import { Syntax } from './syntax';
import { ExpressionStatement } from './nodes';
import { parse, transpile } from './davinci-mathscript';
import { add, sub, mul, div } from './davinci-mathscript';
import { eq, ne, ge, gt, le, lt } from './davinci-mathscript';
import { pos, neg, tilde } from './davinci-mathscript';

// Complex knows about Scalar, but Scalar does not know about Complex.
class Scalar {
    constructor(public s: number) {
    }

    __add__(/*other*/) {
        return;
    }

    __eq__(/*other*/) {
        throw new Error("__eq__ is not implemented.");
    }

    __ne__(/*other*/) {
        throw new Error("__ne__ is not implemented");
    }

    __lt__(other) {
        if (other instanceof Scalar) {
            return this.s < other.s;
        }
        else {
            return void 0;
        }
    }

    __le__(other) {
        if (other instanceof Scalar) {
            return this.s <= other.s;
        }
        else {
            return void 0;
        }
    }

    __gt__(other) {
        if (other instanceof Scalar) {
            return this.s > other.s;
        }
        else {
            return void 0;
        }
    }

    __ge__(other) {
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

    __rge__(lhs) {
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
}

class Complex {
    constructor(public x: number, public y: number) {
    }

    toString() {
        return "(" + this.x + ", " + this.y + ")";
    }

    __add__(other) {
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

    __radd__(other) {
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

    __sub__(other) {
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

    __rsub__(other) {
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

    __mul__(other) {
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

    __rmul__(other) {
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

    __eq__(other) {
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

    __ne__(other) {
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

    __pos__() {
        return this;
    }

    __neg__() {
        return new Complex(-this.x, -this.y);
    }

    __tilde__() {
        return new Complex(this.x, -this.y);
    }
}

class Foo { }

describe("MathScript", function () {

    function stripWS(s) {
        return s.replace(/\t/g, ' ').replace(/\n/g, ' ').replace(/(\s[\s]+)/g, '');
    }


    describe("Transpile", function () {

        describe("Program", function () {
            it("Basic", function () {
                const src = "42;";
                const program = parse(src);
                expect(program.type).toBe(Syntax.Program);
                expect(program.body[0].type).toBe(Syntax.ExpressionStatement);
                expect((<ExpressionStatement>program.body[0]).expression.type).toBe(Syntax.Literal);
                const code = transpile(src, { operatorOverloading: true });
                expect(code).toBe("42;");
            });
        });

        describe("ExpressionStatement", function () {
            describe("Literal", function () {
                it("number", function () {
                    const src = "23;";
                    const program = parse(src);
                    expect(program.type).toBe(Syntax.Program);
                    expect(program.body[0].type).toBe(Syntax.ExpressionStatement);
                    expect((<ExpressionStatement>program.body[0]).expression.type).toBe(Syntax.Literal);
                    const code = transpile(src, { operatorOverloading: true });
                    expect(code).toBe("23;");
                });
                it("string", function () {
                    const src = "'Hello';";
                    const program = parse(src);
                    expect(program.type).toBe(Syntax.Program);
                    expect(program.body[0].type).toBe(Syntax.ExpressionStatement);
                    expect((<ExpressionStatement>program.body[0]).expression.type).toBe(Syntax.Literal);
                    const code = transpile(src, { operatorOverloading: true });
                    expect(code).toBe("'Hello';");
                });
                it("boolean", function () {
                    const src = "true;";
                    const program = parse(src);
                    expect(program.type).toBe(Syntax.Program);
                    expect(program.body[0].type).toBe(Syntax.ExpressionStatement);
                    expect((<ExpressionStatement>program.body[0]).expression.type).toBe(Syntax.Literal);
                    const code = transpile(src, { operatorOverloading: true });
                    expect(code).toBe("true;");
                });
            });
        });

        describe("BinaryExpression", function () {
            it("+ Addition", function () {
                const code = transpile("a + b", { operatorOverloading: true });
                expect(stripWS(code)).toBe("Ms.add(a, b);");
            });
            it("- Subtraction", function () {
                const code = transpile("a - b", { operatorOverloading: true });
                expect(stripWS(code)).toBe("Ms.sub(a, b);");
            });
            it("* Multiplication", function () {
                const code = transpile("a * b", { operatorOverloading: true });
                expect(stripWS(code)).toBe("Ms.mul(a, b);");
            });
            it("/ Division", function () {
                const code = transpile("a / b", { operatorOverloading: true });
                expect(stripWS(code)).toBe("Ms.div(a, b);");
            });
            it("<< Left Shift", function () {
                const code = transpile("a << b", { operatorOverloading: true });
                expect(stripWS(code)).toBe("Ms.lshift(a, b);");
            });
            it(">> Right Shift", function () {
                const code = transpile("a >> b", { operatorOverloading: true });
                expect(stripWS(code)).toBe("Ms.rshift(a, b);");
            });
            it("^ Wedge", function () {
                const code = transpile("a ^ b", { operatorOverloading: true });
                expect(stripWS(code)).toBe("Ms.wedge(a, b);");
            });
        });

        describe("ConditionalExpression", function () {
            it("", function () {
                const code = transpile("hex.length === 1 ? '0' + hex : '' + hex;", { operatorOverloading: true });
                expect(stripWS(code)).toBe("Ms.eq(hex.length, 1) ? Ms.add('0', hex) : Ms.add('', hex);");
            });
        });

        describe("ForInStatement", function () {
            it("", function () {
                const code = transpile("for (var x in a + b) {x + y}", { operatorOverloading: true });
                expect(stripWS(code)).toBe("for (var x in Ms.add(a, b)) {Ms.add(x, y); }");
            });
        });

        describe("ForStatement", function () {
            it("noLoopCheck: true", function () {
                const src = "for (var x=0; x<10;x++) {z=x+1}";
                const program = parse(src);
                expect(program.type).toBe("Program");
                expect(program.body[0].type).toBe("ForStatement");
                const code = transpile(src, { noLoopCheck: true, operatorOverloading: true });
                expect(stripWS(code)).toBe("for (var x = 0; Ms.lt(x, 10); x++) {z = Ms.add(x, 1); }");
            });
            it("noLoopCheck: false", function () {
                const src = "for (var x=0; x<10;x++) {z=x+1}";
                const program = parse(src);
                expect(program.type).toBe("Program");
                expect(program.body[0].type).toBe("ForStatement");
                const code = transpile(src, { noLoopCheck: false, operatorOverloading: true });
                expect(stripWS(code)).not.toBe("for (var x = 0; Ms.lt(x, 10); x++) {z = Ms.add(x, 1); }");
            });
        });

        describe("LogicalExpression", function () {
            it("eq", function () {
                const code = transpile("a === b", { operatorOverloading: true });
                expect(stripWS(code)).toBe("Ms.eq(a, b);");
            });
            it("ne", function () {
                const code = transpile("a !== b", { operatorOverloading: true });
                expect(stripWS(code)).toBe("Ms.ne(a, b);");
            });
            it("lt", function () {
                const code = transpile("a < b;", { operatorOverloading: true });
                expect(stripWS(code)).toBe("Ms.lt(a, b);");
            });
            it("le", function () {
                const code = transpile("a <= b;", { operatorOverloading: true });
                expect(stripWS(code)).toBe("Ms.le(a, b);");
            });
            it("gt", function () {
                const code = transpile("a > b;", { operatorOverloading: true });
                expect(stripWS(code)).toBe("Ms.gt(a, b);");
            });
            it("ge", function () {
                const code = transpile("a >= b;", { operatorOverloading: true });
                expect(stripWS(code)).toBe("Ms.ge(a, b);");
            });
            it("const x = (p/q) < (a|b);", function () {
                const code = transpile("const x = (p/q) < (a|b);", { operatorOverloading: true });
                expect(stripWS(code)).toBe("const x = Ms.lt(Ms.div(p, q), Ms.vbar(a, b));");
            });
        });

        describe("Precedence", function () {
            it("a << b ^ c", function () {
                var code = transpile("a << b ^ c", { operatorOverloading: true });
                expect(code).toBe("Ms.wedge(Ms.lshift(a, b), c);");
            });
            it("a ^ b << c", function () {
                var code = transpile("a ^ b << c", { operatorOverloading: true });
                expect(code).toBe("Ms.wedge(a, Ms.lshift(b, c));");
            });

            it("a >> b ^ c", function () {
                var code = transpile("a >> b ^ c", { operatorOverloading: true });
                expect(code).toBe("Ms.wedge(Ms.rshift(a, b), c);");
            });
            it("a ^ b >> c", function () {
                var code = transpile("a ^ b >> c", { operatorOverloading: true });
                expect(code).toBe("Ms.wedge(a, Ms.rshift(b, c));");
            });

            it("a | b ^ c", function () {
                var code = transpile("a | b ^ c", { operatorOverloading: true });
                expect(code).toBe("Ms.wedge(Ms.vbar(a, b), c);");
            });
            it("a ^ b | c", function () {
                var code = transpile("a ^ b | c", { operatorOverloading: true });
                expect(code).toBe("Ms.wedge(a, Ms.vbar(b, c));");
            });

            it("a ^ b * c", function () {
                var code = transpile("a ^ b * c", { operatorOverloading: true });
                expect(code).toBe("Ms.mul(Ms.wedge(a, b), c);");
            });
            it("a * b ^ c", function () {
                var code = transpile("a * b ^ c", { operatorOverloading: true });
                expect(code).toBe("Ms.mul(a, Ms.wedge(b, c));");
            });

            it("a * b + c", function () {
                var code = transpile("a * b + c", { operatorOverloading: true });
                expect(code).toBe("Ms.add(Ms.mul(a, b), c);");
            });
            it("a + b * c", function () {
                var code = transpile("a + b * c", { operatorOverloading: true });
                expect(code).toBe("Ms.add(a, Ms.mul(b, c));");
            });
        });

        describe("BreakStatement", function () {
            it("should be preserved", function () {
                var sourceCode = "switch (x) { case 1: {}break; }";
                var code = transpile(sourceCode, { operatorOverloading: true });
                expect(stripWS(code)).toBe(sourceCode);
            });
        });

        describe("CallExpression", function () {
            it("should transpile its arguments", function () {
                var code = transpile("f(2+3)", { operatorOverloading: true });
                expect(code).toBe("f(Ms.add(2, 3));");
            });
        });

        describe("DoWhileStatement", function () {
            it("noLoopCheck: true", function () {
                const code = transpile("do {z = x * y; } while (a + b)", { noLoopCheck: true, operatorOverloading: true });
                expect(stripWS(code)).toBe("do {z = Ms.mul(x, y); } while (Ms.add(a, b));");
            });
            it("noLoopCheck: false", function () {
                const code = transpile("do {z = x * y; } while (a + b)", { noLoopCheck: false, operatorOverloading: true });
                expect(stripWS(code)).not.toBe("do {z = Ms.mul(x, y); } while (Ms.add(a, b));");
            });
        });

        it("EmptyStatement ';;'", function () {
            const code = transpile("; ;", { operatorOverloading: true });
            expect(stripWS(code)).toBe("; ;");
        });

        it("IfStatement", function () {
            const code = transpile("if (1+2)\n    2+3\nelse\n    3+4", { operatorOverloading: true });
            expect(stripWS(code)).toBe("if (Ms.add(1, 2))Ms.add(2, 3); elseMs.add(3, 4);");
        });

        it("FunctionDeclaration", function () {
            const code = transpile("function f(x) {return x + 1;}", { operatorOverloading: true });
            expect(stripWS(code)).toBe("function f(x) {return Ms.add(x, 1); }");
        });
        it("Property", function () {
            const code = transpile("var x = {expr: function(){var c = a + b}};", { operatorOverloading: true });
            expect(stripWS(code)).toBe("var x = {expr: function () {var c = Ms.add(a, b);} };");
        });
        it("ThisExpression", function () {
            const code = transpile("(function() {var x;x=new Foo();z=x+y;}.call(this));", { operatorOverloading: true });
            expect(stripWS(code)).toBe("(function () {var x;x = new Foo();z = Ms.add(x, y); }.call(this));");
        });
        it("SwitchStatement", function () {
            const code = transpile("switch (a+b) {case p+q: {r+s} default: {x+y}}", { operatorOverloading: true });
            expect(stripWS(code)).toBe("switch (Ms.add(a, b)) { case Ms.add(p, q): {Ms.add(r, s);} default: {Ms.add(x, y);} }");
        });
        it("ThrowStatement", function () {
            const code = transpile("throw new Error(a + b);", { operatorOverloading: true });
            expect(stripWS(code)).toBe("throw new Error(Ms.add(a, b));");
        });
        it("TryStatement (1)", function () {
            const code = transpile("try {var a=b+c;} catch (e) { }", { operatorOverloading: true });
            expect(stripWS(code)).toBe("try {var a = Ms.add(b, c); } catch (e) { }");
        });
        it("TryStatement (2)", function () {
            const code = transpile("try { } catch (e) {var x=y+z;}", { operatorOverloading: true });
            expect(stripWS(code)).toBe("try { } catch (e) {var x = Ms.add(y, z); }");
        });
        it("TryStatement (3)", function () {
            const code = transpile("try {} catch (e) { } finally {var a=b+c;}", { operatorOverloading: true });
            expect(stripWS(code)).toBe("try { } catch (e) { } finally {var a = Ms.add(b, c); }");
        });
        it("ReturnStatement", function () {
            const code = stripWS(transpile("function f(x) {return x + 1;}", { operatorOverloading: true }));
            expect(stripWS(code)).toBe("function f(x) {return Ms.add(x, 1); }");
        });
        describe("UnaryExpression", function () {
            describe("+", function () {
                it("default", function () {
                    const code = transpile("+1;");
                    expect(stripWS(code)).toBe("+1;");
                });
                it("undefined", function () {
                    const code = transpile("+1;", { operatorOverloading: undefined });
                    expect(stripWS(code)).toBe("+1;");
                });
                it("noop", function () {
                    const code = transpile("+1;", { operatorOverloading: false });
                    expect(stripWS(code)).toBe("+1;");
                });
                it("operatorOverloading", function () {
                    const code = transpile("+1;", { operatorOverloading: true });
                    expect(stripWS(code)).toBe("Ms.pos(1);");
                });
            });
            describe("-", function () {
                it("default", function () {
                    const code = transpile("-1;");
                    expect(stripWS(code)).toBe("-1;");
                });
                it("undefined", function () {
                    const code = transpile("-1;", { operatorOverloading: undefined });
                    expect(stripWS(code)).toBe("-1;");
                });
                it("noop", function () {
                    const code = transpile("-1;", { operatorOverloading: false });
                    expect(stripWS(code)).toBe("-1;");
                });
                it("operatorOverloading", function () {
                    const code = transpile("-1;", { operatorOverloading: true });
                    expect(stripWS(code)).toBe("Ms.neg(1);");
                });
            });
            describe("!", function () {
                it("default", function () {
                    const code = transpile("!1;");
                    expect(stripWS(code)).toBe("!1;");
                });
                it("undefined", function () {
                    const code = transpile("!1;", { operatorOverloading: undefined });
                    expect(stripWS(code)).toBe("!1;");
                });
                it("noop", function () {
                    const code = transpile("!1;", { operatorOverloading: false });
                    expect(stripWS(code)).toBe("!1;");
                });
                it("operatorOverloading", function () {
                    const code = transpile("!1;", { operatorOverloading: true });
                    expect(stripWS(code)).toBe("Ms.bang(1);");
                });
            });
            describe("~", function () {
                it("default", function () {
                    const code = transpile("~1;");
                    expect(stripWS(code)).toBe("~1;");
                });
                it("undefined", function () {
                    const code = transpile("~1;", { operatorOverloading: undefined });
                    expect(stripWS(code)).toBe("~1;");
                });
                it("noop", function () {
                    const code = transpile("~1;", { operatorOverloading: false });
                    expect(stripWS(code)).toBe("~1;");
                });
                it("operatorOverloading", function () {
                    const code = transpile("~1;", { operatorOverloading: true });
                    expect(stripWS(code)).toBe("Ms.tilde(1);");
                });
            });
        });
        it("VariableDeclaration", function () {
            const code = transpile("var x = eight.vectorE3(1, 0, 0); var y = eight.vectorE3(0, 2, 0); console.log(x+y);", { operatorOverloading: true });
            expect(stripWS(code)).toBe("var x = eight.vectorE3(1, 0, 0); var y = eight.vectorE3(0, 2, 0); console.log(Ms.add(x, y));");
        });
        describe("WhileStatement", function () {
            it("noLoopCheck: true", function () {
                const code = transpile("while (a + b) {z = x * y; }", { noLoopCheck: true, operatorOverloading: true });
                expect(stripWS(code)).toBe("while (Ms.add(a, b)) {z = Ms.mul(x, y); }");
            });
            it("noLoopCheck: false", function () {
                const code = transpile("while (a + b) {z = x * y; }", { noLoopCheck: false, operatorOverloading: true });
                expect(stripWS(code)).not.toBe("while (Ms.add(a, b)) {z = Ms.mul(x, y); }");
            });
        });
    });

    describe("Runtime", function () {
        describe("add", function () {
            it("add(number,number);", function () {
                const a = 2;
                const b = 3;
                const sum = add(a, b);
                expect(sum).toBe(a + b);
            });
            it("add(Complex,Complex);", function () {
                const a = new Complex(2, 3);
                const b = new Complex(5, 7);
                const c = <Complex>a.__add__(b);
                const sum = add(a, b);
                expect(c.x).toBe(7);
                expect(c.y).toBe(10);
                expect(sum.x).toBe(c.x);
                expect(sum.y).toBe(c.y);
            });
            it("add(Complex,number);", function () {
                const a = new Complex(2, 3);
                const b = 5;
                const c = <Complex>a.__add__(b);
                const sum = add(a, b);
                expect(c.x).toBe(7);
                expect(c.y).toBe(3);
                expect(sum.x).toBe(c.x);
                expect(sum.y).toBe(c.y);
            });
            it("add(number, Complex);", function () {
                const a = 5;
                const b = new Complex(2, 3);
                const c = <Complex>b.__radd__(a);
                const sum = add(a, b);
                expect(c.x).toBe(7);
                expect(c.y).toBe(3);
                expect(sum.x).toBe(c.x);
                expect(sum.y).toBe(c.y);
            });
            it("add(Complex,Scalar);", function () {
                const a = new Complex(2, 3);
                const b = new Scalar(5);
                const c = <Complex>a.__add__(b);
                const sum = add(a, b);
                expect(c.x).toBe(7);
                expect(c.y).toBe(3);
                expect(sum.x).toBe(c.x);
                expect(sum.y).toBe(c.y);
            });
            it("add(Scalar,Complex);", function () {
                const a = new Scalar(5);
                const b = new Complex(2, 3);
                const c = <Complex>b.__radd__(a);
                const sum = add(a, b);
                expect(c.x).toBe(7);
                expect(c.y).toBe(3);
                expect(sum.x).toBe(c.x);
                expect(sum.y).toBe(c.y);
            });
            it("add(Complex,Foo);", function () {
                const a = new Complex(2, 3);
                const b = new Foo();
                // const c = a.__add__(b);
                const sum = add(a, b);
                expect(sum).toBe("(2, 3)[object Object]");
            });
            it("add(Foo, Complex);", function () {
                const a = new Foo();
                const b = new Complex(2, 3);
                // const c = b.__radd__(a);
                const sum = add(a, b);
                expect(sum).toBe("[object Object](2, 3)");
            });
            it("add(Foo, Foo);", function () {
                const a = new Foo();
                const b = new Foo();
                const sum = add(a, b);
                expect(sum).toBe("[object Object][object Object]");
            });
            it("add(string,string);", function () {
                const a = "Hello, ";
                const b = "World!";
                const sum = add(a, b);
                expect(sum).toBe("Hello, World!");
            });
        });
        describe("sub", function () {
            it("sub(number,number);", function () {
                const diff = sub(2, 3);
                expect(diff).toBe(-1);
            });
            it("sub(Complex,Complex);", function () {
                const a = new Complex(2, 3);
                const b = new Complex(5, 7);
                const c = <Complex>a.__sub__(b);
                const d = sub(a, b);
                expect(c.x).toBe(-3);
                expect(c.y).toBe(-4);
                expect(d.x).toBe(c.x);
                expect(d.y).toBe(c.y);
            });
            it("sub(Complex,number);", function () {
                const a = new Complex(2, 3);
                const b = 5;
                const c = <Complex>a.__sub__(b);
                const d = sub(a, b);
                expect(c.x).toBe(-3);
                expect(c.y).toBe(3);
                expect(d.x).toBe(c.x);
                expect(d.y).toBe(c.y);
            });
            it("sub(number, Complex);", function () {
                const a = 5;
                const b = new Complex(2, 3);
                const c = <Complex>b.__rsub__(a);
                const d = sub(a, b);
                expect(c.x).toBe(3);
                expect(c.y).toBe(-3);
                expect(d.x).toBe(c.x);
                expect(d.y).toBe(c.y);
            });
            it("sub(Complex,Scalar);", function () {
                const a = new Complex(2, 3);
                const b = new Scalar(5);
                const c = <Complex>a.__sub__(b);
                const d = sub(a, b);
                expect(c.x).toBe(-3);
                expect(c.y).toBe(3);
                expect(d.x).toBe(c.x);
                expect(d.y).toBe(c.y);
            });
            it("sub(Scalar,Complex);", function () {
                const a = new Scalar(5);
                const b = new Complex(2, 3);
                const c = <Complex>b.__rsub__(a);
                const d = sub(a, b);
                expect(c.x).toBe(3);
                expect(c.y).toBe(-3);
                expect(d.x).toBe(c.x);
                expect(d.y).toBe(c.y);
            });
            it("sub(Complex,Foo);", function () {
                const a = new Complex(2, 3);
                const b = new Foo();
                // const c = a.__sub__(b);
                const d = sub(a, b);
                expect(isNaN(d)).toBe(true);
            });
            it("sub(Foo, Complex);", function () {
                const a = new Foo();
                const b = new Complex(2, 3);
                // const c = b.__rsub__(a);
                const d = sub(a, b);
                expect(isNaN(d)).toBe(true);
            });
            it("sub(Foo, Foo);", function () {
                const a = new Foo();
                const b = new Foo();
                const c = sub(a, b);
                expect(isNaN(c)).toBe(true);
            });
            it("sub(string,string);", function () {
                const a = "Hello, ";
                const b = "World!";
                const d = sub(a, b);
                expect(isNaN(d)).toBe(true);
            });
        });

        describe("mul", function () {
            it("mul(number,number);", function () {
                expect(mul(2, 3)).toBe(6);
            });
            it("mul(Complex,Complex);", function () {
                const a = new Complex(2, 3);
                const b = new Complex(5, 7);
                const c = <Complex>a.__mul__(b);
                const d = mul(a, b);
                expect(c.x).toBe(-11);
                expect(c.y).toBe(29);
                expect(d.x).toBe(c.x);
                expect(d.y).toBe(c.y);
            });
            it("mul(Complex,number);", function () {
                const a = new Complex(2, 3);
                const b = 5;
                const c = <Complex>a.__mul__(b);
                const d = mul(a, b);
                expect(c.x).toBe(10);
                expect(c.y).toBe(15);
                expect(d.x).toBe(c.x);
                expect(d.y).toBe(c.y);
            });
            it("mul(number, Complex);", function () {
                const a = 5;
                const b = new Complex(2, 3);
                const c = <Complex>b.__rmul__(a);
                const d = mul(a, b);
                expect(c.x).toBe(10);
                expect(c.y).toBe(15);
                expect(d.x).toBe(c.x);
                expect(d.y).toBe(c.y);
            });
            it("mul(Complex,Scalar);", function () {
                const a = new Complex(2, 3);
                const b = new Scalar(5);
                const c = <Complex>a.__mul__(b);
                const d = mul(a, b);
                expect(c.x).toBe(10);
                expect(c.y).toBe(15);
                expect(d.x).toBe(c.x);
                expect(d.y).toBe(c.y);
            });
            it("mul(Scalar,Complex);", function () {
                const a = new Scalar(5);
                const b = new Complex(2, 3);
                const c = <Complex>b.__rmul__(a);
                const d = mul(a, b);
                expect(c.x).toBe(10);
                expect(c.y).toBe(15);
                expect(d.x).toBe(c.x);
                expect(d.y).toBe(c.y);
            });
            it("mul(Complex,Foo);", function () {
                const a = new Complex(2, 3);
                const b = new Foo();
                // const c = a.__mul__(b);
                const d = mul(a, b);
                expect(isNaN(d)).toBe(true);
            });
            it("mul(Foo, Complex);", function () {
                const a = new Foo();
                const b = new Complex(2, 3);
                // const c = b.__rmul__(a);
                const d = mul(a, b);
                expect(isNaN(d)).toBe(true);
            });
            it("mul(Foo, Foo);", function () {
                const a = new Foo();
                const b = new Foo();
                const c = mul(a, b);
                expect(isNaN(c)).toBe(true);
            });
            it("mul(string,string);", function () {
                const a = "Hello, ";
                const b = "World!";
                const c = mul(a, b);
                expect(isNaN(c)).toBe(true);
            });
        });

        describe("div", function () {
            it("div(number,number);", function () {
                expect(div(6, 2)).toBe(3);
            });
            it("mul(Complex,Complex);", function () {
                const a = new Complex(2, 3);
                const b = new Complex(5, 7);
                const c = <Complex>a.__mul__(b);
                const d = mul(a, b);
                expect(c.x).toBe(-11);
                expect(c.y).toBe(29);
                expect(d.x).toBe(c.x);
                expect(d.y).toBe(c.y);
            });
            it("mul(Complex,number);", function () {
                const a = new Complex(2, 3);
                const b = 5;
                const c = <Complex>a.__mul__(b);
                const d = mul(a, b);
                expect(c.x).toBe(10);
                expect(c.y).toBe(15);
                expect(d.x).toBe(c.x);
                expect(d.y).toBe(c.y);
            });
            it("mul(number, Complex);", function () {
                const a = 5;
                const b = new Complex(2, 3);
                const c = <Complex>b.__rmul__(a);
                const d = mul(a, b);
                expect(c.x).toBe(10);
                expect(c.y).toBe(15);
                expect(d.x).toBe(c.x);
                expect(d.y).toBe(c.y);
            });
            it("mul(Complex,Scalar);", function () {
                const a = new Complex(2, 3);
                const b = new Scalar(5);
                const c = <Complex>a.__mul__(b);
                const d = mul(a, b);
                expect(c.x).toBe(10);
                expect(c.y).toBe(15);
                expect(d.x).toBe(c.x);
                expect(d.y).toBe(c.y);
            });
            it("mul(Scalar,Complex);", function () {
                const a = new Scalar(5);
                const b = new Complex(2, 3);
                const c = <Complex>b.__rmul__(a);
                const d = mul(a, b);
                expect(c.x).toBe(10);
                expect(c.y).toBe(15);
                expect(d.x).toBe(c.x);
                expect(d.y).toBe(c.y);
            });
            it("mul(Complex,Foo);", function () {
                const a = new Complex(2, 3);
                const b = new Foo();
                // const c = a.__mul__(b);
                const d = mul(a, b);
                expect(isNaN(d)).toBe(true);
            });
            it("mul(Foo, Complex);", function () {
                const a = new Foo();
                const b = new Complex(2, 3);
                // const c = b.__rmul__(a);
                const d = mul(a, b);
                expect(isNaN(d)).toBe(true);
            });
            it("mul(Foo, Foo);", function () {
                const a = new Foo();
                const b = new Foo();
                const c = mul(a, b);
                expect(isNaN(c)).toBe(true);
            });
            it("mul(string,string);", function () {
                const a = "Hello, ";
                const b = "World!";
                const c = mul(a, b);
                expect(isNaN(c)).toBe(true);
            });
        });

        describe("eq", function () {
            it("eq(number,number);", function () {
                const a = 2;
                const b = 3;
                const sum = eq(a, b);
                expect(sum).toBe(false);
            });
            it("eq(undefined,number);", function () {
                const a = undefined;
                const b = 3;
                const sum = eq(a, b);
                expect(sum).toBe(a === b);
            });
            it("eq(number, undefined);", function () {
                const a = 2;
                const b = undefined;
                const sum = eq(a, b);
                expect(sum).toBe(a === b);
            });
            it("eq(Complex,Complex);", function () {
                const a = new Complex(2, 3);
                const b = new Complex(5, 7);
                const c = a.__eq__(b);
                const same = eq(a, b);
                expect(c).toBe(false);
                expect(same).toBe(false);
            });
            it("eq(Complex,undefined);", function () {
                const a = new Complex(2, 3);
                const b = undefined;
                const c = a.__eq__(b);
                const same = eq(a, b);
                expect(c).toBe(undefined);
                expect(same).toBe(false);
            });
        });

        describe("ne", function () {
            it("ne(number,number);", function () {
                const a = 2;
                const b = 3;
                const sum = ne(a, b);
                expect(sum).toBe(true);
            });
            it("ne(undefined,number);", function () {
                const a = undefined;
                const b = 3;
                const sum = ne(a, b);
                expect(sum).toBe(a !== b);
            });
            it("ne(number, undefined);", function () {
                const a = 2;
                const b = undefined;
                const sum = ne(a, b);
                expect(sum).toBe(a !== b);
            });
            it("ne(null,number);", function () {
                const a = null;
                const b = 3;
                const sum = ne(a, b);
                expect(sum).toBe(a !== b);
            });
            it("ne(number, null);", function () {
                const a = 2;
                const b = null;
                const sum = ne(a, b);
                expect(sum).toBe(a !== b);
            });
            it("ne(Complex,Complex);", function () {
                const a = new Complex(2, 3);
                const b = new Complex(5, 7);
                const c = a.__ne__(b);
                const diff = ne(a, b);
                expect(c).toBe(true);
                expect(diff).toBe(true);
            });
            it("ne(Complex,undefined);", function () {
                const a = new Complex(2, 3);
                const b = undefined;
                const c = a.__ne__(b);
                const diff = ne(a, b);
                expect(c).toBe(undefined);
                expect(diff).toBe(true);
            });
        });

        describe("ge", function () {
            it("ge(number,number);", function () {
                expect(ge(2, 3)).toBe(false);
                expect(ge(3, 3)).toBe(true);
                expect(ge(4, 3)).toBe(true);
            });
            it("ge(undefined,number);", function () {
                const a = undefined;
                const b = 3;
                const sum = ge(a, b);
                expect(sum).toBe(false);
            });
            it("ge(number, undefined);", function () {
                const a = 2;
                const b = undefined;
                const sum = ge(a, b);
                expect(sum).toBe(false);
            });
            it("ge(null,number);", function () {
                const a = null;
                const b = 3;
                const sum = ge(a, b);
                expect(sum).toBe(false);
            });
            it("ge(number, null);", function () {
                const a = 2;
                const b = null;
                const sum = ge(a, b);
                expect(sum).toBe(true);
            });
            it("ge(Scalar(2),Scalar(3));", function () {
                const a = new Scalar(2);
                const b = new Scalar(3);
                const c = a.__ge__(b);
                const diff = ge(a, b);
                expect(c).toBe(false);
                expect(diff).toBe(false);
            });
            it("ge(Scalar(3),Scalar(3));", function () {
                const a = new Scalar(3);
                const b = new Scalar(3);
                const c = a.__ge__(b);
                const diff = ge(a, b);
                expect(c).toBe(true);
                expect(diff).toBe(true);
            });
            it("ge(Scalar,undefined);", function () {
                const a = new Scalar(2);
                const b = undefined;
                const c = a.__ge__(b);
                const diff = ge(a, b);
                expect(c).toBe(undefined);
                expect(diff).toBe(false);
            });
            it("ge(Scalar(2),3);", function () {
                const a = new Scalar(2);
                const b = 3;
                const c = a.__ge__(b);
                const diff = ge(a, b);
                expect(c).toBe(false);
                expect(diff).toBe(false);
            });
            it("ge(2, Scalar(3));", function () {
                const a = 2;
                const b = new Scalar(3);
                const c = b.__rge__(a);
                const diff = ge(a, b);
                expect(c).toBe(false);
                expect(diff).toBe(false);
            });
        });

        describe("gt", function () {
            it("gt(number,number);", function () {
                expect(gt(2, 3)).toBe(false);
                expect(gt(3, 3)).toBe(false);
                expect(gt(4, 3)).toBe(true);
            });
            it("gt(undefined,number);", function () {
                const a = undefined;
                const b = 3;
                const sum = gt(a, b);
                expect(sum).toBe(false);
            });
            it("gt(number, undefined);", function () {
                const a = 2;
                const b = undefined;
                const sum = gt(a, b);
                expect(sum).toBe(false);
            });
            it("gt(null,number);", function () {
                const a = null;
                const b = 3;
                const sum = gt(a, b);
                expect(sum).toBe(false);
            });
            it("gt(number, null);", function () {
                const a = 2;
                const b = null;
                const sum = gt(a, b);
                expect(sum).toBe(true);
            });
            it("gt(Scalar(2),Scalar(3));", function () {
                const a = new Scalar(2);
                const b = new Scalar(3);
                const c = a.__gt__(b);
                const diff = gt(a, b);
                expect(c).toBe(false);
                expect(diff).toBe(false);
            });
            it("gt(Scalar(3),Scalar(3));", function () {
                const a = new Scalar(3);
                const b = new Scalar(3);
                const c = a.__gt__(b);
                const diff = gt(a, b);
                expect(c).toBe(false);
                expect(diff).toBe(false);
            });
            it("gt(Scalar(4),Scalar(3));", function () {
                const a = new Scalar(4);
                const b = new Scalar(3);
                const c = a.__gt__(b);
                const diff = gt(a, b);
                expect(c).toBe(true);
                expect(diff).toBe(true);
            });
            it("gt(Scalar,undefined);", function () {
                const a = new Scalar(2);
                const b = undefined;
                const c = a.__gt__(b);
                const diff = gt(a, b);
                expect(c).toBe(undefined);
                expect(diff).toBe(false);
            });
        });

        describe("le", function () {
            it("le(number,number);", function () {
                expect(le(2, 3)).toBe(true);
                expect(le(3, 3)).toBe(true);
                expect(le(4, 3)).toBe(false);
            });
            it("le(undefined,number);", function () {
                const a = undefined;
                const b = 3;
                const sum = le(a, b);
                expect(sum).toBe(false);
            });
            it("le(number, undefined);", function () {
                const a = 2;
                const b = undefined;
                const sum = le(a, b);
                expect(sum).toBe(false);
            });
            it("le(null,number);", function () {
                const a = null;
                const b = 3;
                const sum = le(a, b);
                expect(sum).toBe(true);
            });
            it("le(number, null);", function () {
                const a = 2;
                const b = null;
                const sum = le(a, b);
                expect(sum).toBe(false);
            });
            it("le(Scalar(2),Scalar(3));", function () {
                const a = new Scalar(2);
                const b = new Scalar(3);
                const c = a.__le__(b);
                const diff = le(a, b);
                expect(c).toBe(true);
                expect(diff).toBe(true);
            });
            it("le(Scalar(3),Scalar(3));", function () {
                const a = new Scalar(3);
                const b = new Scalar(3);
                const c = a.__le__(b);
                const diff = le(a, b);
                expect(c).toBe(true);
                expect(diff).toBe(true);
            });
            it("le(Scalar(4),Scalar(3));", function () {
                const a = new Scalar(4);
                const b = new Scalar(3);
                const c = a.__le__(b);
                const diff = le(a, b);
                expect(c).toBe(false);
                expect(diff).toBe(false);
            });
            it("le(Scalar,undefined);", function () {
                const a = new Scalar(2);
                const b = undefined;
                const c = a.__le__(b);
                const diff = le(a, b);
                expect(c).toBe(undefined);
                expect(diff).toBe(false);
            });
        });

        describe("lt", function () {
            it("lt(number,number);", function () {
                expect(lt(2, 3)).toBe(true);
                expect(lt(3, 3)).toBe(false);
                expect(lt(4, 3)).toBe(false);
            });
            it("lt(undefined,number);", function () {
                const a = undefined;
                const b = 3;
                const sum = lt(a, b);
                expect(sum).toBe(false);
            });
            it("lt(number, undefined);", function () {
                const a = 2;
                const b = undefined;
                const sum = lt(a, b);
                expect(sum).toBe(false);
            });
            it("lt(null,number);", function () {
                const a = null;
                const b = 3;
                const sum = lt(a, b);
                expect(sum).toBe(true);
            });
            it("lt(number, null);", function () {
                const a = 2;
                const b = null;
                const sum = lt(a, b);
                expect(sum).toBe(false);
            });
            it("lt(Scalar(2),Scalar(3));", function () {
                const a = new Scalar(2);
                const b = new Scalar(3);
                const c = a.__lt__(b);
                const diff = lt(a, b);
                expect(c).toBe(true);
                expect(diff).toBe(true);
            });
            it("lt(Scalar,undefined);", function () {
                const a = new Scalar(2);
                const b = undefined;
                const c = a.__lt__(b);
                const diff = lt(a, b);
                expect(c).toBe(undefined);
                expect(diff).toBe(false);
            });
        });

        describe("neg", function () {
            it("neg(number);", function () {
                expect(neg(2)).toBe(-2);
            });
            it("neg(undefined);", function () {
                expect(neg(undefined)).toBeNaN();
            });
            it("neg(Complex);", function () {
                const z = new Complex(2, 3);
                const q = z.__neg__();
                expect(q.x).toBe(-2);
                expect(q.y).toBe(-3);
                expect(neg(z).x).toBe(-2);
                expect(neg(z).y).toBe(-3);
            });
        });

        describe("pos", function () {
            it("pos(number);", function () {
                expect(pos(2)).toBe(2);
            });
            it("pos(undefined);", function () {
                expect(pos(undefined)).toBeNaN();
            });
            it("pos(Complex);", function () {
                const z = new Complex(2, 3);
                const q = z.__pos__();
                expect(q.x).toBe(2);
                expect(q.y).toBe(3);
                expect(pos(z).x).toBe(2);
                expect(pos(z).y).toBe(3);
            });
        });

        describe("tilde", function () {
            it("tilde(number);", function () {
                expect(pos(2)).toBe(2);
            });
            it("tilde(Complex);", function () {
                const z = new Complex(2, 3);
                const q = z.__tilde__();
                expect(q.x).toBe(2);
                expect(q.y).toBe(-3);
                expect(tilde(z).x).toBe(2);
                expect(tilde(z).y).toBe(-3);
            });
        });

    });
});
