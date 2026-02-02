import { handler as functionHandler } from '../netlify/functions/api.mjs';

async function invoke(path = '/') {
  const event = {
    path,
    httpMethod: 'GET',
    headers: {},
    body: null,
    requestContext: {},
  };

  const context = {};

  try {
    const res = await functionHandler(event, context);
    console.log('Function response statusCode:', res.statusCode);
    console.log('Headers:', res.headers);
    console.log('Body (truncated):', res.body ? res.body.slice(0, 200) : null);
  } catch (err) {
    console.error('Function invocation error:', err);
  }
}


await invoke('/');
await invoke('/about');
await invoke('/dashboard');
