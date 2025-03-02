  // server/src/app.js
  import express from 'express';
  import cors from 'cors';
  import dotenv from 'dotenv';
  import { createAuthMiddleware } from './middleware/auth.js';
  import { errorHandler } from './middleware/errorHandler.js';
  
  // Load environment variables
  dotenv.config();
  
  // Import routes 
  import extractRoute from './routes/endpoints/extractRoute.js';
  import geoRoute from './routes/endpoints/geoRoute.js';
  import pdnsRoute from './routes/endpoints/pdnsRoute.js';
  import shodanRoute from './routes/endpoints/shodanRoute.js';
  
  const app = express();
  
  // Add middleware
  app.use(cors());
  app.use(createAuthMiddleware()); // Use the auth middleware
  app.use(express.json());
  app.use(express.text({ type: 'text/plain' }));
  
  // Mount routes
  app.use('/api', extractRoute);
  app.use('/api', geoRoute);
  app.use('/api', pdnsRoute);
  app.use('/api', shodanRoute);
  
  // Add error handler
  app.use(errorHandler);
  
  // Start server
  const port = process.env.PORT || 3000;
  
  if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
  
  export default app;