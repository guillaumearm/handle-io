handle-io :sparkles: *[WIP]*
===============

[![CircleCI branch](https://img.shields.io/circleci/project/github/guillaumearm/handle-io/master.svg)](https://circleci.com/gh/guillaumearm/handle-io)
[![codecov](https://codecov.io/gh/guillaumearm/handle-io/branch/master/graph/badge.svg)](https://codecov.io/gh/guillaumearm/handle-io)
[![Greenkeeper badge](https://badges.greenkeeper.io/guillaumearm/handle-io.svg)](https://greenkeeper.io/)
[![NSP Status](https://nodesecurity.io/orgs/trapcodien/projects/b8c8d3c2-8b69-4c0b-bd6b-09d8b490dcbe/badge)](https://nodesecurity.io/orgs/trapcodien/projects/b8c8d3c2-8b69-4c0b-bd6b-09d8b490dcbe)
[![dependencies Status](https://david-dm.org/guillaumearm/handle-io/status.svg)](https://david-dm.org/guillaumearm/handle-io)
[![devDependencies Status](https://david-dm.org/guillaumearm/handle-io/dev-status.svg)](https://david-dm.org/guillaumearm/handle-io?type=dev)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/guillaumearm/handle-io/blob/master/CONTRIBUTING.md)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Highly inspired by [funkia/io](https://github.com/funkia/io) and [redux-saga](https://github.com/redux-saga/redux-saga), this library intends to wrap small pieces of impure code, orchestrates and tests them.

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

## Install (not published on npm yet)

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

### Deal with errors
You can throw an error inside IO or Handler.

Errors can be try/catch 3 ways :
- try/catch [io .run()](#run-io) method.
- try/catch [handler .run()](#run-handlers) method.
- try/catch inside handler.

e.g.

```js
const handler1 = handler(function*() {
  throw new Error();
});

const io1 = io(() => { throw new Error() });

// handler2 is safe, it can't throw because it handlers errors
const handler2 = handler(function*() {
  try {
    yield io1();
    yield handler1();
  } catch (e) {
    console.error(e);
  }
});

```

### Asynchronous code

*[WIP]*

### API

*[WIP]*


## License
[MIT](https://github.com/guillaumearm/handle-io/blob/master/LICENSE)
