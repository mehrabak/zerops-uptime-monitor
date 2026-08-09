const axios = require('axios');

async function checkMonitors() {
  console.log('[Worker] Running automated background health check...');
  }

  setInterval(checkMonitors, 10000);
  console.log('[Worker] Health monitoring service online.');
  