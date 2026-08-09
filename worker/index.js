const axios = require('axios');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

async function performHealthChecks() {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/monitors`);
    const monitors = res.data;

    console.log(`[Worker Engine] Inspecting ${monitors.length} targets...`);

    for (const item of monitors) {
      const startTime = Date.now();
      let status = 'DOWN';
      let statusCode = 0;
      let latency = 0;

      try {
        const checkRes = await axios.get(item.url, { 
          timeout: 6000,
          headers: { 'User-Agent': 'Zerops-Uptime-Bot/1.0' } 
        });
        
        statusCode = checkRes.status;
        if (statusCode >= 200 && statusCode < 400) {
          status = 'UP';
        }
      } catch (err) {
        status = 'DOWN';
        statusCode = err.response ? err.response.status : 504; // Gateway Timeout or Connection Error
      }

      latency = Date.now() - startTime;

      // Report metrics to backend
      await axios.post(`${BACKEND_URL}/api/monitors/update`, {
        id: item.id,
        status,
        statusCode,
        latency: status === 'UP' ? latency : 0
      });

      console.log(`[Check] ${item.url} | Status: ${statusCode} | Latency: ${latency}ms`);
    }
  } catch (error) {
    console.error('[Worker Error]', error.message);
  }
}

setInterval(performHealthChecks, 8000);
performHealthChecks();
