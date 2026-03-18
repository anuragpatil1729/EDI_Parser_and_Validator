# Healthcare EDI Validator

Production-focused monorepo web application to parse, validate, and visualize US healthcare X12 EDI files (837P, 837I, 835, 834), with AI-assisted explanations.

## Monorepo Structure

- `apps/web` - Next.js App Router + TypeScript + Tailwind UI frontend.
- `apps/api` - Node.js Express gateway for upload/parse/validate/chat orchestration.
- `services/parser` - FastAPI parser service.
- `services/validator` - FastAPI validator service.
- `services/ai` - FastAPI AI explanation service using Gemini API (with safe fallback).
- `packages` - Shared dictionaries and rules.
- `infra/docker` - Service Dockerfiles.

## API Contract

- `POST /upload` -> `{ fileId }`
- `POST /parse` -> parsed EDI JSON
- `POST /validate` -> `issues[]`
- `POST /chat` -> explanation + suggested fix

## Run

```bash
docker compose up --build
```

Web: `http://localhost:3000`

## Notes

- Parser splits segments by `~`, elements by `*`, detects transaction type from `ST`, and emits loop tree JSON.
- Validator executes required, regex, and cross-field checks using JSON rule files under `services/validator/app/rules`.
- AI service uses `GEMINI_API_KEY` if configured; otherwise returns deterministic fallback guidance.
