handle-io [WIP]
===============

Wrap side effects, combine them, and make this combination testable

## Purpose
Highly inspired by [funkia/io](https://github.com/funkia/io) and [redux-saga](https://github.com/redux-saga/redux-saga), this library intends to wrap small pieces of impure code, orchestrates and test them.

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

## Installation
[WIP]
### IOs

io is just a wrapper for functions and arguments.
In some way, it transforms impure functions into pure functions

Conceptually, a io could be just :

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

All the idea of this library is to apply **IOs** in structures called **handlers**.

### Handlers
A **handler** is a wrapped pure [generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) which just apply some **IOs** or **handlers**.

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

But what about test a **handler** which apply **IOs** and return values ?

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
Same as for **IOs**, there is a **.run()** method :

```js
addValues().run() // => 42
```

And same as for **IOs**, don't use **.run()** everywhere in your codebase.

**handlers** are combinable together : **you can yield a handler**.

## API
**[WIP]**
