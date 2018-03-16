handle-io :sparkles:
===============

[![CircleCI branch](https://img.shields.io/circleci/project/github/guillaumearm/handle-io/master.svg)](https://circleci.com/gh/guillaumearm/handle-io)
[![codecov](https://codecov.io/gh/guillaumearm/handle-io/branch/master/graph/badge.svg)](https://codecov.io/gh/guillaumearm/handle-io)
[![npm](https://img.shields.io/npm/v/handle-io.svg)](https://www.npmjs.com/package/handle-io)
[![Greenkeeper badge](https://badges.greenkeeper.io/guillaumearm/handle-io.svg)](https://greenkeeper.io/)
[![NSP Status](https://nodesecurity.io/orgs/trapcodien/projects/b050060a-8207-40cc-a229-89efb0e8cee0/badge)](https://nodesecurity.io/orgs/trapcodien/projects/b050060a-8207-40cc-a229-89efb0e8cee0)
[![dependencies Status](https://david-dm.org/guillaumearm/handle-io/status.svg)](https://david-dm.org/guillaumearm/handle-io)
[![devDependencies Status](https://david-dm.org/guillaumearm/handle-io/dev-status.svg)](https://david-dm.org/guillaumearm/handle-io?type=dev)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/guillaumearm/handle-io/blob/master/CONTRIBUTING.md)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Highly inspired by [funkia/io](https://github.com/funkia/io) and [redux-saga](https://github.com/redux-saga/redux-saga), this library intends to wrap small pieces of impure code, orchestrates and tests them.

## Purpose

### Test side effects orchestration without pain

```js
testHandler(logTwice('hello world'))
  .matchIo(log('hello world'))
  .matchIo(log('hello world'))
  .run()
```

This piece of code is an assertion, an error will be thrown if something goes wrong:
- wrong io function,
- wrong io arguments,
- too much io ran,
- not enough io ran.

# Getting started

## Install (not published on npm yet)

```js
npm install --save handle-io
```

### IO

io is just a wrapper for functions and arguments.
In some way, it transforms impure functions into pure functions.

Conceptually, an io function could just be defined in this way:

```js
const log = (...args) => [console.log, args];
```

but in `handle-io`, it isn't.

##### Create IO functions

You can use `io` to create one:
```js
const { io } = require('handle-io');
const log = io(console.log);
```

##### Run IO functions

Calling .run() after applies the io function to its arguments:
```js
log('Hello', 'World').run(); // print Hello World
```

**Keep in mind**: pieces of code with `.run()` cannot be tested properly.

The idea of this library is to apply an **IO** function inside a structure called **handler**.

### Handlers
A **handler** is a wrapped pure [generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) which just apply some **IO** function and/or **handler**.

**e.g.**

```js
const { io, handler } = require('handle-io');

const log = io(console.log);

const logTwice = handler(function*(...args) {
  yield log(...args);
  yield log(...args);
});
```

#### Writing tests for handlers

Writing tests for **handlers** is very simple (please see the first example above).

What about testing a **handler** which applies an **IO** function and returns values ?

**There is a very simple way**:
- using the second argument of the .matchIo() method to mock returned values.
- using .shouldReturn() to assert on the final value

**e.g.**

```js
const { io, handler } = require('handle-io');

const getEnv = io((v) => process.env[v]);

const addValues = handler(function*() {
  const value1 = yield getEnv('VALUE1');
  const value2 = yield getEnv('VALUE2');
  return value1 + value2;
});

testHandler(addValues())
  .matchIo(getEnv('VALUE1'), 32),
  .matchIo(getEnv('VALUE2'), 10),
  .shouldReturn(42)
  .run()
```

#### Running handlers
Same as for **IO** functions, there is a **.run()** method:

```js
addValues().run() // => 42
```

Likewise, don't use handlers' **.run()** everywhere in your codebase.

**handlers** are combinable together: **you can yield a handler**.

### Promise support

`handle-io` supports promises and allows you to create asynchronous IO.

**e.g.**
```js
// async io
const sleep = io((ms) => new Promise(resolve => setTimeout(resolve, ms)));

// create an async combination
const sleepSecond = handler(function*(s) {
  yield sleep(s * 1000);
  return s;
});

// test this combination synchronously
testHander(sleepSecond(42))
  .matchIo(sleep(42000))
  .shouldReturn(42)
  .run()
```

Please note that `sleep(n)` and `sleepSecond(n)` will expose .run() methods that return a promise.

**e.g.**
```js
sleepSecond(1).run().then((n) => {
  console.log(`${n} second(s) waited`);
})
```

### Deal with errors
The simplest way to handle errors with `handle-io` is to use try/catch blocks.

As you can see in the example below, you can try/catch any errors inside a handler:
- Synchronous error (thrown) from io,
- Asynchronous error (unhandled promise rejection) from io,
- Thrown from another handler.

**e.g.**
```js
const handler1 = handler(function*() {
  throw new Error();
});

// Synchronous IO
const io1 = io(() => { throw new Error() });

// Asynchronous IO
const io2 = io(() => Promise.reject(new Error()));

// handler2 is safe, it can't throw because it handles errors
const handler2 = handler(function*() {
  try {
    yield io1();
    yield io2();
    yield handler1();
  } catch (e) {
    console.error(e);
  }
});

```

## License
[MIT](https://github.com/guillaumearm/handle-io/blob/master/LICENSE)
