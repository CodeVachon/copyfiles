Copy Files
==========

Copy Files from one Directory to Another

## Install
add this to your `.npmrc` file.

```sh
@christophervachon:registry=https://npm.christophervachon.com
```

and Download using NPM Scope `@christophervachon`

```sh
npm install @christophervachon/copyfiles extend inquirer
```

## Usage
```js
const copyfiles = require("@christophervachon/copyfiles");

copyfiles("./src/images/", "./public/images/").then(result => {
    console.log(result);
});
```

## Options

### filter

Used to filter to only the assets your want to copy

```js
// Select only jpg files
return copyfiles(source, destination, {
    filter: new RegExp("\.jpg$", "i");
});
```
