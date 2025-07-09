/*
When a derived (child) class has its own constructor, it must call super() within that constructor
before using this. This invokes the constructor of the parent (superclass), ensuring that the parent's
properties and methods are properly initialized on the this object before the child class adds its own
specific properties or logic.
*/

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    
    // Maintains proper stack trace for where our error was thrown (only on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ErrorHandler;