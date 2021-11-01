---
title: Typescript and Webpack Essentials
layout: blog_post
categories:
topic: typescript
tags: typescript
---

## Typescript Uses the ES6

Inside the `tsconfig.json` file you must set "module": to "es2015".

### How to Export

```javascript
export const myNumbers = [1, 2, 3, 4];
const animals = ["Panda", "Bear", "Eagle"]; // Not available directly outside the module

export function myLogger() {
  console.log(myNumbers, animals);
}

export class Alligator {
  constructor() {
    // ...
  }
}
```

### How to Import

```javascript
import { myLogger, Alligator } from 'app.js';
import myLogger as Logger from 'app.js';
import * as Utils from 'app.js';

```

### Webpack

```bash
npm install --save-dev webpack webpack-cli webpack-dev-server typescript ts-loader

```
#### What is Webpack
Webpack is a module bundler. Webpack examines the modules in your application, transforms them, and the bundles them back together in one or more bundles. Webpack looks for an entry point which is the module that kicks everything off. Webpack needs loaders to process files other than .js and .json. Webpack uses plugins to process the bundle after the bundling has finished (e.g. HtmlWebpackPlugin). 
Webpack processes the file in a different manner depending on the environment.

#### Installing

```bash
touch webpack.config.js

```

Make sure that inside `tsconfig.json` file that `rootDir = ...` is commented out and that `sourceMap = true`.

```javascript
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/app.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "dist",
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
```

#### In Production

```javascript
const path = require("path");
const CleanPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/app.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "none",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [new CleanPlugin.CleanWebpackPlugin()],
};
```
#### Scripts

```javascript
###inside the package.json file

...
"scripts": {
	"start": "webpack-dev-server",
	"build": "webpack --config webpack.config.prod.js"
}


```
