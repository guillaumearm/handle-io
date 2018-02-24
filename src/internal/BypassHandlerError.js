const BypassHandlerError = function(...args) {
  this.e = new Error(...args);
}

BypassHandlerError.prototype.toString = function() {
  return `${this.constructor.name}: ${this.e.message}`;
}

export default BypassHandlerError;
