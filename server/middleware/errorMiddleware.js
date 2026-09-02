/**
 * Centralized Global Error Handling Middleware
 * Formats all application errors into a consistent JSON response structure.
 * Prevents stack trace exposure in production environments.
 */
export const errorHandler = (err, req, res, next) => {
  // If the status code was not previously set to an error code, default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
