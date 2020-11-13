// Production
const isProd = false;

// Timeout
const times = {
  short: 3000,
  medium: 5000,
  long: 10000,
};

// ServerURL
const dev = { port: 5000, host: 'localhost' };
const prod = { port: 5000, host: '' };
const serverURL = `http${isProd ? 's' : ''}://${isProd ? prod.host : dev.host}:${
  isProd ? prod.port : dev.port
}`;
console.log(`Hitting ${serverURL}`);

export { isProd, times, serverURL };
