// server/src/middleware/errorHandler.js
/**
 * Custom error class for API errors
 */
export class AppError extends Error {
    /**
     * @param {number} statusCode - HTTP status code
     * @param {string} message - Error message
     */
    constructor(statusCode, message) {
      super(message);
      this.statusCode = statusCode;
      this.name = 'AppError';
    }
  }
  
  /**
   * Global error handler middleware
   * @param {Error} err - Error object
   * @param {import('express').Request} req - Express request
   * @param {import('express').Response} res - Express response
   * @param {import('express').NextFunction} next - Express next function
   */
  export const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        error: err.message
      });
    }
  
    console.error('Unhandled error:', err);
    return res.status(500).json({
      error: 'Internal server error'
    });
  };