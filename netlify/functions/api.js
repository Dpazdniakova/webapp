import serverless from 'serverless-http';
import app from '../../app.js';

const handler = serverless(app);

export const handlerFunction = async (event, context) => {
  return handler(event, context);
};

// Netlify looks for an exported `handler` symbol; re-export with that name
export { handlerFunction as handler };