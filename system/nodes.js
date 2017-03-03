System.register(["./syntax"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var syntax_1, ArrayExpression, ArrayPattern, ArrowFunctionExpression, AssignmentExpression, AssignmentPattern, AsyncArrowFunctionExpression, AsyncFunctionDeclaration, AsyncFunctionExpression, AwaitExpression, BinaryExpression, BlockStatement, BreakStatement, CallExpression, CatchClause, ClassBody, ClassDeclaration, ClassExpression, ComputedMemberExpression, ConditionalExpression, ContinueStatement, DebuggerStatement, Directive, DoWhileStatement, EmptyStatement, ExportAllDeclaration, ExportDefaultDeclaration, ExportNamedDeclaration, ExportSpecifier, ExpressionStatement, ForInStatement, ForOfStatement, ForStatement, FunctionDeclaration, FunctionExpression, Identifier, IfStatement, Import, ImportDeclaration, ImportDefaultSpecifier, ImportNamespaceSpecifier, ImportSpecifier, LabeledStatement, Literal, MetaProperty, MethodDefinition, Module, NewExpression, ObjectExpression, ObjectPattern, Property, RegexLiteral, RestElement, RestProperty, ReturnStatement, Script, SequenceExpression, SpreadElement, SpreadProperty, StaticMemberExpression, Super, SwitchCase, SwitchStatement, TaggedTemplateExpression, TemplateElement, TemplateLiteral, ThisExpression, ThrowStatement, TryStatement, UnaryExpression, UpdateExpression, VariableDeclaration, VariableDeclarator, WhileStatement, WithStatement, YieldExpression;
    return {
        setters: [
            function (syntax_1_1) {
                syntax_1 = syntax_1_1;
            }
        ],
        execute: function () {
            ArrayExpression = (function () {
                function ArrayExpression(elements) {
                    this.type = syntax_1.Syntax.ArrayExpression;
                    this.elements = elements;
                }
                return ArrayExpression;
            }());
            exports_1("ArrayExpression", ArrayExpression);
            ArrayPattern = (function () {
                function ArrayPattern(elements) {
                    this.type = syntax_1.Syntax.ArrayPattern;
                    this.elements = elements;
                }
                return ArrayPattern;
            }());
            exports_1("ArrayPattern", ArrayPattern);
            ArrowFunctionExpression = (function () {
                function ArrowFunctionExpression(params, body, expression) {
                    this.type = syntax_1.Syntax.ArrowFunctionExpression;
                    this.id = null;
                    this.params = params;
                    this.body = body;
                    this.generator = false;
                    this.expression = expression;
                    this.async = false;
                }
                return ArrowFunctionExpression;
            }());
            exports_1("ArrowFunctionExpression", ArrowFunctionExpression);
            AssignmentExpression = (function () {
                function AssignmentExpression(operator, left, right) {
                    this.type = syntax_1.Syntax.AssignmentExpression;
                    this.operator = operator;
                    this.left = left;
                    this.right = right;
                }
                return AssignmentExpression;
            }());
            exports_1("AssignmentExpression", AssignmentExpression);
            AssignmentPattern = (function () {
                function AssignmentPattern(left, right) {
                    this.type = syntax_1.Syntax.AssignmentPattern;
                    this.left = left;
                    this.right = right;
                }
                return AssignmentPattern;
            }());
            exports_1("AssignmentPattern", AssignmentPattern);
            AsyncArrowFunctionExpression = (function () {
                function AsyncArrowFunctionExpression(params, body, expression) {
                    this.type = syntax_1.Syntax.ArrowFunctionExpression;
                    this.id = null;
                    this.params = params;
                    this.body = body;
                    this.generator = false;
                    this.expression = expression;
                    this.async = true;
                }
                return AsyncArrowFunctionExpression;
            }());
            exports_1("AsyncArrowFunctionExpression", AsyncArrowFunctionExpression);
            AsyncFunctionDeclaration = (function () {
                function AsyncFunctionDeclaration(id, params, body) {
                    this.type = syntax_1.Syntax.FunctionDeclaration;
                    this.id = id;
                    this.params = params;
                    this.body = body;
                    this.generator = false;
                    this.expression = false;
                    this.async = true;
                }
                return AsyncFunctionDeclaration;
            }());
            exports_1("AsyncFunctionDeclaration", AsyncFunctionDeclaration);
            AsyncFunctionExpression = (function () {
                function AsyncFunctionExpression(id, params, body) {
                    this.type = syntax_1.Syntax.FunctionExpression;
                    this.id = id;
                    this.params = params;
                    this.body = body;
                    this.generator = false;
                    this.expression = false;
                    this.async = true;
                }
                return AsyncFunctionExpression;
            }());
            exports_1("AsyncFunctionExpression", AsyncFunctionExpression);
            AwaitExpression = (function () {
                function AwaitExpression(argument) {
                    this.type = syntax_1.Syntax.AwaitExpression;
                    this.argument = argument;
                }
                return AwaitExpression;
            }());
            exports_1("AwaitExpression", AwaitExpression);
            BinaryExpression = (function () {
                function BinaryExpression(operator, left, right) {
                    var logical = (operator === '||' || operator === '&&');
                    this.type = logical ? syntax_1.Syntax.LogicalExpression : syntax_1.Syntax.BinaryExpression;
                    this.operator = operator;
                    this.left = left;
                    this.right = right;
                }
                return BinaryExpression;
            }());
            exports_1("BinaryExpression", BinaryExpression);
            BlockStatement = (function () {
                function BlockStatement(body) {
                    this.type = syntax_1.Syntax.BlockStatement;
                    this.body = body;
                }
                return BlockStatement;
            }());
            exports_1("BlockStatement", BlockStatement);
            BreakStatement = (function () {
                function BreakStatement(label) {
                    this.type = syntax_1.Syntax.BreakStatement;
                    this.label = label;
                }
                return BreakStatement;
            }());
            exports_1("BreakStatement", BreakStatement);
            CallExpression = (function () {
                function CallExpression(callee, args) {
                    this.type = syntax_1.Syntax.CallExpression;
                    this.callee = callee;
                    this.arguments = args;
                }
                return CallExpression;
            }());
            exports_1("CallExpression", CallExpression);
            CatchClause = (function () {
                function CatchClause(param, body) {
                    this.type = syntax_1.Syntax.CatchClause;
                    this.param = param;
                    this.body = body;
                }
                return CatchClause;
            }());
            exports_1("CatchClause", CatchClause);
            ClassBody = (function () {
                function ClassBody(body) {
                    this.type = syntax_1.Syntax.ClassBody;
                    this.body = body;
                }
                return ClassBody;
            }());
            exports_1("ClassBody", ClassBody);
            ClassDeclaration = (function () {
                function ClassDeclaration(id, superClass, body) {
                    this.type = syntax_1.Syntax.ClassDeclaration;
                    this.id = id;
                    this.superClass = superClass;
                    this.body = body;
                }
                return ClassDeclaration;
            }());
            exports_1("ClassDeclaration", ClassDeclaration);
            ClassExpression = (function () {
                function ClassExpression(id, superClass, body) {
                    this.type = syntax_1.Syntax.ClassExpression;
                    this.id = id;
                    this.superClass = superClass;
                    this.body = body;
                }
                return ClassExpression;
            }());
            exports_1("ClassExpression", ClassExpression);
            ComputedMemberExpression = (function () {
                function ComputedMemberExpression(object, property) {
                    this.type = syntax_1.Syntax.MemberExpression;
                    this.computed = true;
                    this.object = object;
                    this.property = property;
                }
                return ComputedMemberExpression;
            }());
            exports_1("ComputedMemberExpression", ComputedMemberExpression);
            ConditionalExpression = (function () {
                function ConditionalExpression(test, consequent, alternate) {
                    this.type = syntax_1.Syntax.ConditionalExpression;
                    this.test = test;
                    this.consequent = consequent;
                    this.alternate = alternate;
                }
                return ConditionalExpression;
            }());
            exports_1("ConditionalExpression", ConditionalExpression);
            ContinueStatement = (function () {
                function ContinueStatement(label) {
                    this.type = syntax_1.Syntax.ContinueStatement;
                    this.label = label;
                }
                return ContinueStatement;
            }());
            exports_1("ContinueStatement", ContinueStatement);
            DebuggerStatement = (function () {
                function DebuggerStatement() {
                    this.type = syntax_1.Syntax.DebuggerStatement;
                }
                return DebuggerStatement;
            }());
            exports_1("DebuggerStatement", DebuggerStatement);
            Directive = (function () {
                function Directive(expression, directive) {
                    this.type = syntax_1.Syntax.ExpressionStatement;
                    this.expression = expression;
                    this.directive = directive;
                }
                return Directive;
            }());
            exports_1("Directive", Directive);
            DoWhileStatement = (function () {
                function DoWhileStatement(body, test) {
                    this.type = syntax_1.Syntax.DoWhileStatement;
                    this.body = body;
                    this.test = test;
                }
                return DoWhileStatement;
            }());
            exports_1("DoWhileStatement", DoWhileStatement);
            EmptyStatement = (function () {
                function EmptyStatement() {
                    this.type = syntax_1.Syntax.EmptyStatement;
                }
                return EmptyStatement;
            }());
            exports_1("EmptyStatement", EmptyStatement);
            ExportAllDeclaration = (function () {
                function ExportAllDeclaration(source) {
                    this.type = syntax_1.Syntax.ExportAllDeclaration;
                    this.source = source;
                }
                return ExportAllDeclaration;
            }());
            exports_1("ExportAllDeclaration", ExportAllDeclaration);
            ExportDefaultDeclaration = (function () {
                function ExportDefaultDeclaration(declaration) {
                    this.type = syntax_1.Syntax.ExportDefaultDeclaration;
                    this.declaration = declaration;
                }
                return ExportDefaultDeclaration;
            }());
            exports_1("ExportDefaultDeclaration", ExportDefaultDeclaration);
            ExportNamedDeclaration = (function () {
                function ExportNamedDeclaration(declaration, specifiers, source) {
                    this.type = syntax_1.Syntax.ExportNamedDeclaration;
                    this.declaration = declaration;
                    this.specifiers = specifiers;
                    this.source = source;
                }
                return ExportNamedDeclaration;
            }());
            exports_1("ExportNamedDeclaration", ExportNamedDeclaration);
            ExportSpecifier = (function () {
                function ExportSpecifier(local, exported) {
                    this.type = syntax_1.Syntax.ExportSpecifier;
                    this.exported = exported;
                    this.local = local;
                }
                return ExportSpecifier;
            }());
            exports_1("ExportSpecifier", ExportSpecifier);
            ExpressionStatement = (function () {
                function ExpressionStatement(expression) {
                    this.type = syntax_1.Syntax.ExpressionStatement;
                    this.expression = expression;
                }
                return ExpressionStatement;
            }());
            exports_1("ExpressionStatement", ExpressionStatement);
            ForInStatement = (function () {
                function ForInStatement(left, right, body) {
                    this.type = syntax_1.Syntax.ForInStatement;
                    this.left = left;
                    this.right = right;
                    this.body = body;
                    this.each = false;
                }
                return ForInStatement;
            }());
            exports_1("ForInStatement", ForInStatement);
            ForOfStatement = (function () {
                function ForOfStatement(left, right, body) {
                    this.type = syntax_1.Syntax.ForOfStatement;
                    this.left = left;
                    this.right = right;
                    this.body = body;
                }
                return ForOfStatement;
            }());
            exports_1("ForOfStatement", ForOfStatement);
            ForStatement = (function () {
                function ForStatement(init, test, update, body) {
                    this.type = syntax_1.Syntax.ForStatement;
                    this.init = init;
                    this.test = test;
                    this.update = update;
                    this.body = body;
                }
                return ForStatement;
            }());
            exports_1("ForStatement", ForStatement);
            FunctionDeclaration = (function () {
                function FunctionDeclaration(id, params, body, generator) {
                    this.type = syntax_1.Syntax.FunctionDeclaration;
                    this.id = id;
                    this.params = params;
                    this.body = body;
                    this.generator = generator;
                    this.expression = false;
                    this.async = false;
                }
                return FunctionDeclaration;
            }());
            exports_1("FunctionDeclaration", FunctionDeclaration);
            FunctionExpression = (function () {
                function FunctionExpression(id, params, body, generator) {
                    this.type = syntax_1.Syntax.FunctionExpression;
                    this.id = id;
                    this.params = params;
                    this.body = body;
                    this.generator = generator;
                    this.expression = false;
                    this.async = false;
                }
                return FunctionExpression;
            }());
            exports_1("FunctionExpression", FunctionExpression);
            Identifier = (function () {
                function Identifier(name) {
                    this.type = syntax_1.Syntax.Identifier;
                    this.name = name;
                }
                return Identifier;
            }());
            exports_1("Identifier", Identifier);
            IfStatement = (function () {
                function IfStatement(test, consequent, alternate) {
                    this.type = syntax_1.Syntax.IfStatement;
                    this.test = test;
                    this.consequent = consequent;
                    this.alternate = alternate;
                }
                return IfStatement;
            }());
            exports_1("IfStatement", IfStatement);
            Import = (function () {
                function Import() {
                    this.type = syntax_1.Syntax.Import;
                }
                return Import;
            }());
            exports_1("Import", Import);
            ImportDeclaration = (function () {
                function ImportDeclaration(specifiers, source) {
                    this.type = syntax_1.Syntax.ImportDeclaration;
                    this.specifiers = specifiers;
                    this.source = source;
                }
                return ImportDeclaration;
            }());
            exports_1("ImportDeclaration", ImportDeclaration);
            ImportDefaultSpecifier = (function () {
                function ImportDefaultSpecifier(local) {
                    this.type = syntax_1.Syntax.ImportDefaultSpecifier;
                    this.local = local;
                }
                return ImportDefaultSpecifier;
            }());
            exports_1("ImportDefaultSpecifier", ImportDefaultSpecifier);
            ImportNamespaceSpecifier = (function () {
                function ImportNamespaceSpecifier(local) {
                    this.type = syntax_1.Syntax.ImportNamespaceSpecifier;
                    this.local = local;
                }
                return ImportNamespaceSpecifier;
            }());
            exports_1("ImportNamespaceSpecifier", ImportNamespaceSpecifier);
            ImportSpecifier = (function () {
                function ImportSpecifier(local, imported) {
                    this.type = syntax_1.Syntax.ImportSpecifier;
                    this.local = local;
                    this.imported = imported;
                }
                return ImportSpecifier;
            }());
            exports_1("ImportSpecifier", ImportSpecifier);
            LabeledStatement = (function () {
                function LabeledStatement(label, body) {
                    this.type = syntax_1.Syntax.LabeledStatement;
                    this.label = label;
                    this.body = body;
                }
                return LabeledStatement;
            }());
            exports_1("LabeledStatement", LabeledStatement);
            Literal = (function () {
                function Literal(value, raw) {
                    this.type = syntax_1.Syntax.Literal;
                    this.value = value;
                    this.raw = raw;
                }
                return Literal;
            }());
            exports_1("Literal", Literal);
            MetaProperty = (function () {
                function MetaProperty(meta, property) {
                    this.type = syntax_1.Syntax.MetaProperty;
                    this.meta = meta;
                    this.property = property;
                }
                return MetaProperty;
            }());
            exports_1("MetaProperty", MetaProperty);
            MethodDefinition = (function () {
                function MethodDefinition(key, computed, value, kind, isStatic) {
                    this.type = syntax_1.Syntax.MethodDefinition;
                    this.key = key;
                    this.computed = computed;
                    this.value = value;
                    this.kind = kind;
                    this.static = isStatic;
                }
                return MethodDefinition;
            }());
            exports_1("MethodDefinition", MethodDefinition);
            Module = (function () {
                function Module(body) {
                    this.type = syntax_1.Syntax.Program;
                    this.body = body;
                    this.sourceType = 'module';
                }
                return Module;
            }());
            exports_1("Module", Module);
            NewExpression = (function () {
                function NewExpression(callee, args) {
                    this.type = syntax_1.Syntax.NewExpression;
                    this.callee = callee;
                    this.arguments = args;
                }
                return NewExpression;
            }());
            exports_1("NewExpression", NewExpression);
            ObjectExpression = (function () {
                function ObjectExpression(properties) {
                    this.type = syntax_1.Syntax.ObjectExpression;
                    this.properties = properties;
                }
                return ObjectExpression;
            }());
            exports_1("ObjectExpression", ObjectExpression);
            ObjectPattern = (function () {
                function ObjectPattern(properties) {
                    this.type = syntax_1.Syntax.ObjectPattern;
                    this.properties = properties;
                }
                return ObjectPattern;
            }());
            exports_1("ObjectPattern", ObjectPattern);
            Property = (function () {
                function Property(kind, key, computed, value, method, shorthand) {
                    this.type = syntax_1.Syntax.Property;
                    this.key = key;
                    this.computed = computed;
                    this.value = value;
                    this.kind = kind;
                    this.method = method;
                    this.shorthand = shorthand;
                }
                return Property;
            }());
            exports_1("Property", Property);
            RegexLiteral = (function () {
                function RegexLiteral(value, raw, pattern, flags) {
                    this.type = syntax_1.Syntax.Literal;
                    this.value = value;
                    this.raw = raw;
                    this.regex = { pattern: pattern, flags: flags };
                }
                return RegexLiteral;
            }());
            exports_1("RegexLiteral", RegexLiteral);
            RestElement = (function () {
                function RestElement(argument) {
                    this.type = syntax_1.Syntax.RestElement;
                    this.argument = argument;
                }
                return RestElement;
            }());
            exports_1("RestElement", RestElement);
            RestProperty = (function () {
                function RestProperty(argument) {
                    this.type = syntax_1.Syntax.RestProperty;
                    this.argument = argument;
                }
                return RestProperty;
            }());
            exports_1("RestProperty", RestProperty);
            ReturnStatement = (function () {
                function ReturnStatement(argument) {
                    this.type = syntax_1.Syntax.ReturnStatement;
                    this.argument = argument;
                }
                return ReturnStatement;
            }());
            exports_1("ReturnStatement", ReturnStatement);
            Script = (function () {
                function Script(body) {
                    this.type = syntax_1.Syntax.Program;
                    this.body = body;
                    this.sourceType = 'script';
                }
                return Script;
            }());
            exports_1("Script", Script);
            SequenceExpression = (function () {
                function SequenceExpression(expressions) {
                    this.type = syntax_1.Syntax.SequenceExpression;
                    this.expressions = expressions;
                }
                return SequenceExpression;
            }());
            exports_1("SequenceExpression", SequenceExpression);
            SpreadElement = (function () {
                function SpreadElement(argument) {
                    this.type = syntax_1.Syntax.SpreadElement;
                    this.argument = argument;
                }
                return SpreadElement;
            }());
            exports_1("SpreadElement", SpreadElement);
            SpreadProperty = (function () {
                function SpreadProperty(argument) {
                    this.type = syntax_1.Syntax.SpreadProperty;
                    this.argument = argument;
                }
                return SpreadProperty;
            }());
            exports_1("SpreadProperty", SpreadProperty);
            StaticMemberExpression = (function () {
                function StaticMemberExpression(object, property) {
                    this.type = syntax_1.Syntax.MemberExpression;
                    this.computed = false;
                    this.object = object;
                    this.property = property;
                }
                return StaticMemberExpression;
            }());
            exports_1("StaticMemberExpression", StaticMemberExpression);
            Super = (function () {
                function Super() {
                    this.type = syntax_1.Syntax.Super;
                }
                return Super;
            }());
            exports_1("Super", Super);
            SwitchCase = (function () {
                function SwitchCase(test, consequent) {
                    this.type = syntax_1.Syntax.SwitchCase;
                    this.test = test;
                    this.consequent = consequent;
                }
                return SwitchCase;
            }());
            exports_1("SwitchCase", SwitchCase);
            SwitchStatement = (function () {
                function SwitchStatement(discriminant, cases) {
                    this.type = syntax_1.Syntax.SwitchStatement;
                    this.discriminant = discriminant;
                    this.cases = cases;
                }
                return SwitchStatement;
            }());
            exports_1("SwitchStatement", SwitchStatement);
            TaggedTemplateExpression = (function () {
                function TaggedTemplateExpression(tag, quasi) {
                    this.type = syntax_1.Syntax.TaggedTemplateExpression;
                    this.tag = tag;
                    this.quasi = quasi;
                }
                return TaggedTemplateExpression;
            }());
            exports_1("TaggedTemplateExpression", TaggedTemplateExpression);
            TemplateElement = (function () {
                function TemplateElement(value, tail) {
                    this.type = syntax_1.Syntax.TemplateElement;
                    this.value = value;
                    this.tail = tail;
                }
                return TemplateElement;
            }());
            exports_1("TemplateElement", TemplateElement);
            TemplateLiteral = (function () {
                function TemplateLiteral(quasis, expressions) {
                    this.type = syntax_1.Syntax.TemplateLiteral;
                    this.quasis = quasis;
                    this.expressions = expressions;
                }
                return TemplateLiteral;
            }());
            exports_1("TemplateLiteral", TemplateLiteral);
            ThisExpression = (function () {
                function ThisExpression() {
                    this.type = syntax_1.Syntax.ThisExpression;
                }
                return ThisExpression;
            }());
            exports_1("ThisExpression", ThisExpression);
            ThrowStatement = (function () {
                function ThrowStatement(argument) {
                    this.type = syntax_1.Syntax.ThrowStatement;
                    this.argument = argument;
                }
                return ThrowStatement;
            }());
            exports_1("ThrowStatement", ThrowStatement);
            TryStatement = (function () {
                function TryStatement(block, handler, finalizer) {
                    this.type = syntax_1.Syntax.TryStatement;
                    this.block = block;
                    this.handler = handler;
                    this.finalizer = finalizer;
                }
                return TryStatement;
            }());
            exports_1("TryStatement", TryStatement);
            UnaryExpression = (function () {
                function UnaryExpression(operator, argument) {
                    this.type = syntax_1.Syntax.UnaryExpression;
                    this.operator = operator;
                    this.argument = argument;
                    this.prefix = true;
                }
                return UnaryExpression;
            }());
            exports_1("UnaryExpression", UnaryExpression);
            UpdateExpression = (function () {
                function UpdateExpression(operator, argument, prefix) {
                    this.type = syntax_1.Syntax.UpdateExpression;
                    this.operator = operator;
                    this.argument = argument;
                    this.prefix = prefix;
                }
                return UpdateExpression;
            }());
            exports_1("UpdateExpression", UpdateExpression);
            VariableDeclaration = (function () {
                function VariableDeclaration(declarations, kind) {
                    this.type = syntax_1.Syntax.VariableDeclaration;
                    this.declarations = declarations;
                    this.kind = kind;
                }
                return VariableDeclaration;
            }());
            exports_1("VariableDeclaration", VariableDeclaration);
            VariableDeclarator = (function () {
                function VariableDeclarator(id, init) {
                    this.type = syntax_1.Syntax.VariableDeclarator;
                    this.id = id;
                    this.init = init;
                }
                return VariableDeclarator;
            }());
            exports_1("VariableDeclarator", VariableDeclarator);
            WhileStatement = (function () {
                function WhileStatement(test, body) {
                    this.type = syntax_1.Syntax.WhileStatement;
                    this.test = test;
                    this.body = body;
                }
                return WhileStatement;
            }());
            exports_1("WhileStatement", WhileStatement);
            WithStatement = (function () {
                function WithStatement(object, body) {
                    this.type = syntax_1.Syntax.WithStatement;
                    this.object = object;
                    this.body = body;
                }
                return WithStatement;
            }());
            exports_1("WithStatement", WithStatement);
            YieldExpression = (function () {
                function YieldExpression(argument, delegate) {
                    this.type = syntax_1.Syntax.YieldExpression;
                    this.argument = argument;
                    this.delegate = delegate;
                }
                return YieldExpression;
            }());
            exports_1("YieldExpression", YieldExpression);
        }
    };
});
