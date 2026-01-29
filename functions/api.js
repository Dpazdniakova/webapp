const serverless = require('serverless-http');

// Dynamic import of ESM app.js so function can remain CommonJS
let appPromise = import('../app.js');

exports.handler = async (event, context) => {
  const { default: app } = await appPromise;
  const handler = serverless(app);
  return handler(event, context);
};