const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

global.monitors = [
  { id: 1, url: 'https://google.com', status: 'UP', latency: 45, lastChecked: new Date() }
  ];

  app.get('/api/monitors', (req, res) => {
    res.json(global.monitors);
    });

    app.post('/api/monitors', (req, res) => {
      const { url } = req.body;
        if (!url) return res.status(400).json({ error: 'URL required' });
          const newMonitor = {
              id: Date.now(),
                  url,
                      status: 'PENDING',
                          latency: 0,
                              lastChecked: new Date()
                                };
                                  global.monitors.push(newMonitor);
                                    res.status(201).json(newMonitor);
                                    });

                                    const PORT = process.env.PORT || 3001;
                                    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
                                    

