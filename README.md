# Welcome to davinci-mathscript

MathScript transcompiler to JavaScript.

[![Build Status](https://travis-ci.org/geometryzen/davinci-mathscript.png)](https://travis-ci.org/geometryzen/davinci-mathscript)

## Contributing

### Building

Open your Terminal.

Clone the davinci-mathscript repo.
```
git clone git://github.com/geometryzen/davinci-mathscript.git
```

Change to the repo directory.
```
cd davinci-mathscript
```

Run
```
npm install
```
to install the tooling dependencies (For this you need to have [Node.js](http://nodejs.org) installed).

Run
```
bower install
```
to install the software dependencies (For this you need to have [Bower](http://bower.io) installed).

Run
```
grunt
```
to compile the source using the TypeScript compiler (For this you need to have [TypeScript](http://www.typescriptlang.org) installed) and to package the individual files into a single JavaScript file.

### Making Changes

Make your changes to the TypeScript files in the _src_ directory. Do not edit the files in the _dist_ directory, these files will be generated.

## Release History
* 1.0.0:  Initial release.
* 1.0.1:  ConditionalExpression
* 1.0.2:  Special Method undefined
* 1.0.3:  ForInStatement
* 1.0.4:  Special Method null
* 1.0.5:  ThrowStatement
* 1.0.6:  Property
* 1.0.7:  SwitchStatement
* 1.0.8:  BreakStatement
* 1.0.9:  WhileStatement
* 1.0.10: Bower update

## License
Copyright (c) 2014-2017 David Holmes  
Licensed under the MIT license.

