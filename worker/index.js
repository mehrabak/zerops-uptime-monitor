const axios = require('axios');

const BACKEND_URL = process.env.WORKER_API_URL || process.env.BACKEND_URL || 'http://localhost:3001';
const INTERVAL = parseInt(process.env.CHECK_INTERVAL_MS || '10000', 10);
let intervalId = null;

async function probe(monitor) {
  const start = Date.now();
  try {
    const res = await axios.get(monitor.url, { timeout: 8000, validateStatus: null });
    const latency = Date.now() - start;
    const status = (res.status >= 200 && res.status < 400) ? 'UP' : 'DOWN';

    await axios.post(`${BACKEND_URL}/api/monitors/update`, {
      id: monitor.id,
      status,
      statusCode: res.status,
      latency
    }).catch(err => console.error('[Worker] Failed to update backend:', err.message));

  } catch (err) {
    const latency = Date.now() - start;
    console.error('[Worker] Probe error for', monitor.url, err.message);
    await axios.post(`${BACKEND_URL}/api/monitors/update`, {
      id: monitor.id,
      status: 'DOWN',
      statusCode: 0,
      latency
    }).catch(e => console.error('[Worker] Failed to update backend:', e.message));
  }
}

async function checkMonitors() {
  console.log('[Worker] Running automated background health check...');
  try {
    const res = await axios.get(`${BACKEND_URL}/api/monitors`, { timeout: 5000 });
    const monitors = Array.isArray(res.data) ? res.data : [];

    await Promise.all(monitors.map(m => probe(m)));
    console.log(`[Worker] Completed checks for ${monitors.length} monitors`);
  } catch (err) {
    console.error('[Worker] Failed to fetch monitors from backend:', err.message);
  }
}

function start() {
  // Run immediately then schedule
  checkMonitors();
  intervalId = setInterval(checkMonitors, INTERVAL);
  console.log(`[Worker] Health monitoring service online. Backend: ${BACKEND_URL} Interval: ${INTERVAL}ms`);
}

function shutdown() {
  console.log('[Worker] Shutting down...');
  if (intervalId) clearInterval(intervalId);
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start();
