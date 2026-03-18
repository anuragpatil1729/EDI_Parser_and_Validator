# Healthcare EDI Parser & Validator

A monorepo starter for parsing, validating, and explaining healthcare X12 EDI files (837/835/834).

## What is included

- **Parser service (FastAPI)**: detects transaction type and parses EDI into segments + a simple loop tree.
- **Validator service (FastAPI)**: applies core structural and format checks with human-friendly error messages.
- **AI assistant service (FastAPI)**: explains likely rejection causes and suggested remediations from validation output.
- **API gateway (Node/Express)**: simple aggregation layer for upload/parse/validate/chat.
- **Web app (Next.js)**: upload, viewer, dashboards, error table, and AI chat panel.

## Quick start

```bash
docker compose up --build
```

Or run services locally from their folders.
