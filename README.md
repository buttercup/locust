# Locust

> Login form location utility

[![Build Status](https://travis-ci.org/buttercup/locust.svg?branch=master)](https://travis-ci.org/buttercup/locust) [![npm version](https://badge.fury.io/js/%40buttercup%2Flocust.svg)](https://www.npmjs.com/package/@buttercup/locust)

## About

Locust helps find **login forms** by searching the DOM for common login form elements. It processes a page and returns _targets_ which can be used for automating logins.

## Installation

Run `npm install @buttercup/locust --save-dev` to install as a dev dependency in a Node JS project.

The npm published version of this libary contains both the minified and unminified sources which can be used directly: `dist/locust.js` and `dist/locust.min.js`.

_When requiring this library directly via `@buttercup/locust`, the minified version provided._

## Usage

Locust is a UMD library, so it can be used in a variety of places (such as in the browser, CommonJS2 and AMD systems). You can either import it:

```javascript
const Locust = require("locust");
```

Or embed it in a webpage and access it via `window.Locust`.

Locust exports a couple of useful methods, but the one which provides the most simple approach to logging in is `getLoginTarget`:

```javascript
const { getLoginTarget } = Locust;

getLoginTarget().login("myUsername", "myPassword");
```

The example above enters the username and password in the **best** form found on the page and then proceeds to submit that form (logging the user in).

_To find all forms on a page, use the `getLoginTargets` method instead, which returns an array of login targets. You can then sort through these to find all the different login forms that may exist._

In the case that you don't want to automatically log in, but still enter the details, you can use the following example:

```javascript
getLoginTarget().enterDetails("myUsername", "myPassword");
```

_**Note** that `getLoginTarget` may return `null` if no form is found, so you should check for this eventuality._

You can also read the [API documentation](https://github.com/buttercup/locust/blob/master/API.md) if you're into that kind of thing.
