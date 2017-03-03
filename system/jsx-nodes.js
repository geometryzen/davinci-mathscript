System.register(["./jsx-syntax"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jsx_syntax_1, JSXClosingElement, JSXElement, JSXEmptyExpression, JSXExpressionContainer, JSXIdentifier, JSXMemberExpression, JSXAttribute, JSXNamespacedName, JSXOpeningElement, JSXSpreadAttribute, JSXText;
    return {
        setters: [
            function (jsx_syntax_1_1) {
                jsx_syntax_1 = jsx_syntax_1_1;
            }
        ],
        execute: function () {
            JSXClosingElement = (function () {
                function JSXClosingElement(name) {
                    this.type = jsx_syntax_1.JSXSyntax.JSXClosingElement;
                    this.name = name;
                }
                return JSXClosingElement;
            }());
            exports_1("JSXClosingElement", JSXClosingElement);
            JSXElement = (function () {
                function JSXElement(openingElement, children, closingElement) {
                    this.type = jsx_syntax_1.JSXSyntax.JSXElement;
                    this.openingElement = openingElement;
                    this.children = children;
                    this.closingElement = closingElement;
                }
                return JSXElement;
            }());
            exports_1("JSXElement", JSXElement);
            JSXEmptyExpression = (function () {
                function JSXEmptyExpression() {
                    this.type = jsx_syntax_1.JSXSyntax.JSXEmptyExpression;
                }
                return JSXEmptyExpression;
            }());
            exports_1("JSXEmptyExpression", JSXEmptyExpression);
            JSXExpressionContainer = (function () {
                function JSXExpressionContainer(expression) {
                    this.type = jsx_syntax_1.JSXSyntax.JSXExpressionContainer;
                    this.expression = expression;
                }
                return JSXExpressionContainer;
            }());
            exports_1("JSXExpressionContainer", JSXExpressionContainer);
            JSXIdentifier = (function () {
                function JSXIdentifier(name) {
                    this.type = jsx_syntax_1.JSXSyntax.JSXIdentifier;
                    this.name = name;
                }
                return JSXIdentifier;
            }());
            exports_1("JSXIdentifier", JSXIdentifier);
            JSXMemberExpression = (function () {
                function JSXMemberExpression(object, property) {
                    this.type = jsx_syntax_1.JSXSyntax.JSXMemberExpression;
                    this.object = object;
                    this.property = property;
                }
                return JSXMemberExpression;
            }());
            exports_1("JSXMemberExpression", JSXMemberExpression);
            JSXAttribute = (function () {
                function JSXAttribute(name, value) {
                    this.type = jsx_syntax_1.JSXSyntax.JSXAttribute;
                    this.name = name;
                    this.value = value;
                }
                return JSXAttribute;
            }());
            exports_1("JSXAttribute", JSXAttribute);
            JSXNamespacedName = (function () {
                function JSXNamespacedName(namespace, name) {
                    this.type = jsx_syntax_1.JSXSyntax.JSXNamespacedName;
                    this.namespace = namespace;
                    this.name = name;
                }
                return JSXNamespacedName;
            }());
            exports_1("JSXNamespacedName", JSXNamespacedName);
            JSXOpeningElement = (function () {
                function JSXOpeningElement(name, selfClosing, attributes) {
                    this.type = jsx_syntax_1.JSXSyntax.JSXOpeningElement;
                    this.name = name;
                    this.selfClosing = selfClosing;
                    this.attributes = attributes;
                }
                return JSXOpeningElement;
            }());
            exports_1("JSXOpeningElement", JSXOpeningElement);
            JSXSpreadAttribute = (function () {
                function JSXSpreadAttribute(argument) {
                    this.type = jsx_syntax_1.JSXSyntax.JSXSpreadAttribute;
                    this.argument = argument;
                }
                return JSXSpreadAttribute;
            }());
            exports_1("JSXSpreadAttribute", JSXSpreadAttribute);
            JSXText = (function () {
                function JSXText(value, raw) {
                    this.type = jsx_syntax_1.JSXSyntax.JSXText;
                    this.value = value;
                    this.raw = raw;
                }
                return JSXText;
            }());
            exports_1("JSXText", JSXText);
        }
    };
});
