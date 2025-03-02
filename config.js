// server/src/config/config.js
/**
 * Application configuration
 */
const config = {
    port: process.env.PORT || 3000,
    auth: {
      users: { 'user': 'pass' }
    }
  };
  
  export default config;
  
