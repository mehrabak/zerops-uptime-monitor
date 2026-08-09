# zerops-uptime-monitor

A lightweight, production-minded uptime monitoring stack designed for reliability, observability, and rapid iteration — built to win hackathons and ship with confidence.

Key highlights
- Designed for clarity: minimal, modular services (backend, worker, frontend).
- Observability-first: logs, health checks, and clear alerting hooks.
- Production-aware defaults: environment-driven configuration, resilient retries, and simple horizontal scaling.

Why this stands out at a hackathon
- Rapidly deployable: zero-friction local setup and clear deployment steps.
- Thoughtful architecture: separates concerns so teams can iterate on UI, checking logic, or integrations independently.
- Demonstrates engineering maturity: focuses on reliability, testability, and operational excellence — the qualities judges look for in short demos.

Features
- Periodic endpoint checks with configurable intervals and retry/backoff.
- Rich result logging for diagnosis and auditing.
- Web frontend to visualize monitors and status at a glance.
- Simple integrations for notifications (webhooks, email, Slack).

Repository layout
- backend/ — API and data layer (Express + lightweight datastore)
- worker/ — background check scheduler and probe logic
- frontend/ — dashboard and status pages

Architecture overview
1. Frontend triggers/visualizes monitors via the Backend API.
2. Worker performs scheduled checks, records results, and triggers alerts.
3. Backend stores monitor definitions and results and exposes a REST API.

Quick start (local)
Prerequisites: Node.js 20+, npm

1. Backend

cd backend
npm install
cp .env.example .env  # populate any required vars
node server.js

2. Worker

cd worker
npm install
cp .env.example .env  # ensure worker has the correct API URL and credentials
node index.js

3. Frontend

cd frontend
npm install
npm start

Key environment variables
- BACKEND_PORT — port the backend listens on (default: 3000)
- DATABASE_URL — connection string for the datastore
- WORKER_API_URL — backend API base URL
- ALERT_WEBHOOK_URL — optional webhook target for alerts

Deployment notes
- This repo contains small, independently deployable components. For production demos, deploy Backend and Worker to separate containers (or serverless functions) and serve the frontend from a static host or CDN.
- Zerops configuration can be used for CI/CD: ensure environment variables and persistent storage are configured per-environment.

How to demo for judges
1. Show the dashboard with a configured monitor (frontend).
2. Trigger a simulated failure (change expected response or block the endpoint) and show the worker detecting it and the backend recording the event.
3. Show logs and the alert delivery to a webhook/Slack channel.
4. Discuss extension points: authentication, distributed tracing, and additional notifier integrations.

Development and testing
- Add unit tests for worker probe logic and backend API routes.
- Use environment fixtures to simulate network timeouts and response variations.

Contributing
- Keep commits focused and well-named.
- Open issues for feature requests and bugs. For hackathon changes, open a short-lived feature branch and submit a concise PR with a demo GIF or short video.

License
MIT — see LICENSE for details.

Contact
- maintainer: mehrabak
- GitHub: https://github.com/mehrabak/zerops-uptime-monitor

Good luck at the hackathon — this project is built to demonstrate technical excellence and operational readiness under pressure.