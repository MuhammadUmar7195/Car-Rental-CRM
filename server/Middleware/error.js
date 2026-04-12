const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Detailed error logging for console (prod/dev both)
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR: ${statusCode} - ${message}`);
  if (err.stack) {
    console.error(`Stack trace:\n${err.stack}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorMiddleware;