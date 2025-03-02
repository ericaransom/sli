// server/src/middleware/auth.js
import basicAuth from 'express-basic-auth';

/**
 * Middleware for route-level authentication
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 */
export const authenticate = (req, res, next) => {
  // Authentication is already handled by the global express-basic-auth middleware
  next();
};

/**
 * Creates basic auth middleware for app-level authentication
 * @returns {import('express').RequestHandler} Express middleware function
 */
export const createAuthMiddleware = () => {
  return basicAuth({
    users: { 
      [process.env.COUNT_FAKEULA_USERNAME || 'user']: 
      process.env.COUNT_FAKEULA_PASSWORD || 'pass' 
    }
  });
};