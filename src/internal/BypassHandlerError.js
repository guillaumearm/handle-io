const BypassHandlerError = function(...args) {
  const e = new Error(...args);
  this.e = e;
  this.message = e.message;
  this.stack = e.stack;
}

BypassHandlerError.prototype.toString = function() {
  return `${this.constructor.name}: ${this.e.message}`;
}

export default BypassHandlerError;
