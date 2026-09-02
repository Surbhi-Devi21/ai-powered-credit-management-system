/**
 * 404 Not Found Middleware
 * Intercepts requests that do not match any registered API routes.
 * Creates an error instance and passes it forward to the global error handler.
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Resource Not Found - [${req.method}] ${req.originalUrl}`);
  res.status(404);
  next(error);
};
