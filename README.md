# API Builder Dashboard

## Overview

API Builder Dashboard is the frontend for a BaaS/API Builder platform that enables users to define APIs through a specification-driven interface and orchestrates their generation and deployment.

The project was built to explore deployment orchestration beyond simply building CRUD APIs.

---

## Features

- ⚡ Flexible API specification builder
- ⚡ Create and manage API definitions
- ⚡ Schema-based request body configuration
- ⚡ Trigger backend generation
- ⚡ Deploy generated APIs to a K3s cluster
- ⚡ Manage APIs through a single dashboard

---

## Workflow


API Definition
↓
Backend Generation
↓
Containerization
↓
Deployment to K3s
↓
Running API


---

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Node.js Backend

---

## Future Improvements

- SSE-based deployment status streaming
- Retry and redeploy mechanisms
- Support for more advanced API patterns
- Improved deployment monitoring

---

## Getting Started

```bash
npm install
npm run dev

---

Related Repositories

- Backend: https://github.com/sah246ir/api-builder-backend
- Container API: https://github.com/sah246ir/api-builder-container-api
