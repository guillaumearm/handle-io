handle-io :wrench: :sparkles: *[WIP]*
===============

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![dependencies Status](https://david-dm.org/guillaumearm/handle-io/status.svg)](https://david-dm.org/guillaumearm/handle-io)
[![devDependencies Status](https://david-dm.org/guillaumearm/handle-io/dev-status.svg)](https://david-dm.org/guillaumearm/handle-io?type=dev)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fguillaumearm%2Fhandle-io.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fguillaumearm%2Fhandle-io?ref=badge_shield)
[![NSP Status](https://nodesecurity.io/orgs/trapcodien/projects/b8c8d3c2-8b69-4c0b-bd6b-09d8b490dcbe/badge)](https://nodesecurity.io/orgs/trapcodien/projects/b8c8d3c2-8b69-4c0b-bd6b-09d8b490dcbe)

Highly inspired by [funkia/io](https://github.com/funkia/io) and [redux-saga](https://github.com/redux-saga/redux-saga), this library intends to wrap small pieces of impure code, orchestrates and test them.

## Purpose

### Test side effects orchestration without pain

```js
testHandler(logTwice('hello world'))
  .matchIo(log('hello world'))
  .matchIo(log('hello world'))
  .run()
```

This piece of code is an assertion, an error will be throw if something go wrong :

- wrong io
- wrong io arguments
- too much runned io
- not enough runned io

# Getting started

## Install (not publish on npm)

```js
npm install --save guillaumearm/handle-io.git
```

### IO

io is just a wrapper for functions and arguments.
In some way, it transforms impure functions into pure functions

Conceptually, an io just could be :

```js
const log = (...args) => [console.log, args];
```

but in `handle-io`, it's not.

##### Create IO

you can use `io` to create one :
```js
const { io } = require('handle-io');
const log = io(console.log);
```

##### Run IO

call .run() after apply io to arguments :
```js
log('Hello', 'World').run(); // print Hello World
```

**keep it mind** : piece of codes with `.run()` cannot be tested properly.

All the idea of this library is to apply **IO** in structures called **handlers**.

### Handlers
A **handler** is a wrapped pure [generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) which just apply some **IO** and/or **handlers**.

**e.g.**

```js
const { io, handler } = require('handle-io');

const log = io(console.log);

const logTwice = handler(function*(...args) {
  yield log(...args);
  yield log(...args);
});
```

#### Write tests for handlers

Write a test for this **handler** is very simple (please see first example above).

But what about test a **handler** which apply **IO** and return values ?

**There is a very simple way** :
- using second argument of .matchIo() method to mock returned values.
- using .shouldReturn() to assert final value

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

#### Run handlers
Same as for **IO**, there is a **.run()** method :

```js
addValues().run() // => 42
```

And same as for **IO**, don't use **.run()** everywhere in your codebase.

**handlers** are combinable together : **you can yield a handler**.

## Asynchronous code

*[WIP]*

## Errors

*[WIP]*

## API

*[WIP]*


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fguillaumearm%2Fhandle-io.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fguillaumearm%2Fhandle-io?ref=badge_large)
