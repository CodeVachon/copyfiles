Copy Files
==========

[TypeDoc](https://lpm.pages.labx.com/copyfiles/) [LPM](http://lpm.labx.local/-/web/detail/@lpm/copyfiles)

Copy Files from one Directory to Another

## Install
add this to your `.npmrc` file.

```sh
@lpm:registry=http://lpm.labx.local/
```

and Download using NPM Scope `@lpm`

```sh
npm install @lpm/copyfiles extend inquirer
```

## Usage
```js
const copyfiles = require("@lpm/copyfiles");

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
