const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory persistent metrics store with check history
let monitors = [
  { 
    id: '1', 
    url: 'https://google.com', 
    status: 'UP', 
    statusCode: 200,
    latency: 42, 
    uptimePercent: 100,
    history: [40, 45, 42, 39, 41, 42], 
    totalChecks: 10,
    successfulChecks: 10,
    lastChecked: new Date().toLocaleTimeString() 
  },
  { 
    id: '2', 
    url: 'https://github.com', 
    status: 'UP', 
    statusCode: 200,
    latency: 110, 
    uptimePercent: 100,
    history: [120, 115, 108, 112, 110], 
    totalChecks: 8,
    successfulChecks: 8,
    lastChecked: new Date().toLocaleTimeString() 
  }
];

// GET All Monitors with Analytics
app.get('/api/monitors', (req, res) => {
  res.json(monitors);
});

// POST New Target
app.post('/api/monitors', (req, res) => {
  let { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  const newMonitor = {
    id: Date.now().toString(),
    url: url,
    status: 'PENDING',
    statusCode: 0,
    latency: 0,
    uptimePercent: 100,
    history: [],
    totalChecks: 0,
    successfulChecks: 0,
    lastChecked: 'Initializing'
  };

  monitors.push(newMonitor);
  res.status(201).json(newMonitor);
});

// Worker update endpoint with history calculations
app.post('/api/monitors/update', (req, res) => {
  const { id, status, statusCode, latency } = req.body;
  const item = monitors.find(m => m.id === id);
  
  if (item) {
    item.status = status;
    item.statusCode = statusCode;
    item.latency = latency;
    item.totalChecks += 1;
    
    if (status === 'UP') {
      item.successfulChecks += 1;
    }

    // Calculate Uptime %
    item.uptimePercent = ((item.successfulChecks / item.totalChecks) * 100).toFixed(1);

    // Keep last 10 latency data points for charting
    item.history.push(latency);
    if (item.history.length > 10) item.history.shift();

    item.lastChecked = new Date().toLocaleTimeString();
  }
  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Analytics Backend running on port ${PORT}`));
  
