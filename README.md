# sharepoint-starterpack
A frontend starter pack for Sharepoint projects at Golin. 

## Features

* Webpack 1 based.
* ES6 as a source.
* Exports in a [umd](https://github.com/umdjs/umd) format so your library works everywhere.
* Linting with [ESLint](http://eslint.org/).

## Process

```
ES6 source files
       |
       |
    webpack
       |
       +--- babel, eslint
       |
  ready to use
     library
  in umd format
```
*Have in mind that you have to build your library before publishing.*

## Getting started

1. Setting up the name of your library
  * Open `webpack.config.js` file and change the value of `libraryName` variable so it matches the name of your library.
  * Open `webpack.config.js` file and provide values for `siteUrl`, `username` and `password` to be able to upload assets to a site.
  * Open `package.json` file and change all occurrences of `sharepoint-starterpack` and `starterpack` so it matches the name of your library.
2. Build your library
  * Run `npm install` to get the project's dependencies
  * Run `npm run build` to produce a minified version of your library.
3. Development mode
  * Having all the dependencies installed run `npm run dev`. This command will generate a non-minified version of your library.
  * Run `npm run devup` to produce a non-minified version of your library and upload *.js and *.css files to a site.

## Scripts

* `npm run build` - produces a production version of your library.
* `npm run dev` - produces a development version of your library.
* `npm run buildup` - produces a production version of your library and uploads *.js and *.css files to a site.
* `npm run devup` - produces a development version of your library and uploads *.js and *.css files to a site.

## Readings

* [Start your own JavaScript library using webpack and ES6](http://krasimirtsonev.com/blog/article/javascript-library-starter-using-webpack-es6)

## Misc

### An example of using dependencies that shouldn’t be resolved by webpack, but should become dependencies of the resulting bundle

In the following example we are excluding React and Lodash:

```js
{
  devtool: 'source-map',
  output: {
    path: '...',
    libraryTarget: 'umd',
    library: '...'
  },
  entry: '...',
  ...
  externals: {
    react: 'react'
    // Use more complicated mapping for lodash.
    // We need to access it differently depending
    // on the environment.
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: '_',
      root: '_'
    }
  }
}
```
## Additional libraries

* SPOCExt: https://github.com/golincode/SPOCExt.git - a library for working with lists, libraries, users and sites.
* assets/js/vendor/camljs.js - simplifies creation of SharePoint CAML queries for client-side scripts. Read more: https://camljs.codeplex.com/.

## ToDo:

1. Publishing Images
