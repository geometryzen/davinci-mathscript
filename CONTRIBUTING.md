## Contributing Guide

This page describes how to contribute changes to davinci-mathscript.

Please do **not** create a pull request without reading this guide first. Failure to do so may result in the **rejection** of the pull request.

**1. Create a ticket in the [issue tracker](https://github.com/geometryzen/davinci-mathscript/issues)**.
This serves as a placeholder for important feedback, review, or any future updates.

**2. Run all the tests**. This requires Node.js: `npm install` to set up, `npm test` to run the tests.

**3. Work on a feature branch**.  If the change still needs some tweaks, it will not clutter the master branch.

**4. Write a reasonable commit message:**

* Keep the first line < 72 characters. Write additional paragraphs if necessary.
* Put the link to the ticket. This is important for cross-referencing purposes.

### Building

Open a terminal window.

Clone the davinci-mathscript repo:
```
git clone git://github.com/geometryzen/davinci-mathscript.git
```

Change to the repo directory:
```
cd davinci-mathscript
```

Install NPM:
```
npm install
npm update
```
to install the tooling dependencies (For this you need to have [Node.js](http://nodejs.org) installed).

Install Bower:
```
bower install
bower update
```
to install the software dependencies (For this you need to have [Bower](http://bower.io) installed).

Install JSPM:
```
jspm install
jspm update
```
to install JSPM, used for testing.

Install TypeScript definitions:
```
tsd install
```
to install TypeScript definitions for Jasmine used in testing.

```
grunt
```
to compile the source using the TypeScript compiler (For this you need to have [TypeScript](http://www.typescriptlang.org) installed) and to package the individual files into a single JavaScript file.

## Making Changes

Make your changes to the TypeScript files in the _src_ directory. Do not edit the files in the _dist_ directory, these files will be generated.

## Testing

```
karma start
```

## Versioning

The following files should be changed.

```
src/davinci-mathscript/config.ts
package.json
bower.json
```

## Git

```
git add --all
git commit -m '...'
git tag -a 1.2.3 -m '...'
git push origin master --tags
```