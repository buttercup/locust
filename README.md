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

Locust is an ESM-only library, so you must include it in another project and use a bundler, such as Webpack, to build it for the browser.

Locust exports a couple of useful methods, but the one which provides the most simple approach to logging in is `getLoginTarget`:

```typescript
import { getLoginTarget } from "@buttercup/locust";

getLoginTarget().login("myUsername", "myPassword");
```

The example above enters the username and password in the **best** form found on the page and then proceeds to submit that form (logging the user in).

_To find all forms on a page, use the `getLoginTargets` method instead, which returns an array of login targets. You can then sort through these to find all the different login forms that may exist._

In the case that you don't want to automatically log in, but still enter the details, you can use the following example:

```typescript
const target = getLoginTarget();
await target.fillUsername("myUsername");
await target.fillPassword("myPassword");
```

You can fill in OTPs using the following:

```typescript
await target.fillOTP("123456");
```

_**Note** that `getLoginTarget` may return `null` if no form is found, so you should check for this eventuality._

You can also read the [API documentation](https://github.com/buttercup/locust/blob/master/API.md) if you're into that kind of thing.

### Events

Locust login targets will emit events when certain things happen. To listen for changes to the values of usernames and passwords on forms simply attach event listeners:

```typescript
const target = getLoginTarget();
target.on("valueChanged", info => {
    if (info.type === "username") {
        console.log("New username:", info.value);
    }
});
// `type` can be "username" or "password"
```

> Login targets subclass [`EventEmitter`](https://github.com/primus/eventemitter3), so you can use all other methods provided by their implementation.

You can also listen to form submission:

```javascript
const target = getLoginTarget();
target.once("formSubmitted", ({ source }) => {
    // `source` will either be "submitButton" or "form"
});
```

## Development

You can run `npm run dev` to generate and watch-files to develop Locust. To create a script that outputs dev information, run `npm run dev:inject` and inject the provided script snippet into pages to test Locust. It won't work all of the time if the Buttercup browser extension is running, nor will it work in consecutive executions.

To run on HTTPS pages consider using a Chrome extension like [Disable Content Security Policy](https://chrome.google.com/webstore/detail/disable-content-security/ieelmcmcagommplceebfedjlakkhpden?hl=en), which will allow injection of local scripts.
