# Healthcare EDI Validator

> Parse, validate, and troubleshoot US healthcare X12 EDI files with AI-powered explanations.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript) ![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker) ![Supabase](https://img.shields.io/badge/Supabase-Optional-3ECF8E?logo=supabase) ![License](https://img.shields.io/badge/License-MIT-green)

---

## Overview

Healthcare EDI Validator is a production-focused monorepo web application that ingests raw X12 EDI files (837P, 837I, 835, 834), parses them into a structured loop/segment tree, runs multi-layer validation checks, and delivers AI-generated explanations and fix suggestions for every validation issue found.

Built for healthcare operations teams, billing specialists, and EDI developers who need a fast, clear way to debug transaction files without reading raw X12 text.

---

## Features

- **Upload** `.edi`, `.txt`, `.dat`, `.x12`, or `.zip` files via drag-and-drop or click
- **Parse** raw X12 into a visual HL loop tree with segment and element drill-down
- **Validate** against required segment rules, format checks (NPI, date, ZIP), enum constraints, and cross-field logic (claim total vs. service line sum, DOB vs. claim date)
- **AI Explain** — ask the AI assistant to explain any validation error and get a suggested fix, powered by Gemini 1.5 Flash (with a deterministic fallback when no API key is configured)
- **Apply Fix** — one-click patch that updates the segment value and re-runs validation live
- **Dashboards** for 837 Claims, 835 Remittance, and 834 Enrollment with search, sort, and bar chart summaries
- **Sample files** — load pre-built valid and invalid EDI files directly from the Upload page
- **Supabase persistence** — optionally store uploads, parse results, and validation results; falls back to in-memory if not configured

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Browser (Next.js)                 │
│         localhost:3000  ·  Tailwind + TypeScript    │
└───────────────────────┬─────────────────────────────┘
                        │ HTTP
┌───────────────────────▼─────────────────────────────┐
│              API Gateway (Express / Node)            │
│                    localhost:4000                   │
└────┬──────────────┬──────────────┬──────────────────┘
     │              │              │
     ▼              ▼              ▼
 Parser :8001  Validator :8002   AI :8003
 (FastAPI)     (FastAPI)         (FastAPI + Gemini)
```

### Monorepo Structure

```
.
├── apps/
│   ├── web/                  # Next.js 14 App Router frontend
│   └── api/                  # Express API gateway (TypeScript)
├── services/
│   ├── parser/               # FastAPI EDI parser
│   ├── validator/            # FastAPI validator with JSON rule engine
│   └── ai/                   # FastAPI AI explanation service
├── packages/
│   ├── edi-core/             # Shared element & segment dictionaries
│   └── rules-engine/         # Base validation rule definitions
├── infra/docker/             # Service Dockerfiles
├── data/
│   ├── sample-files/         # Sample EDI files for testing
│   └── reference/            # CPT, ICD-10, CARC/RARC reference data
└── docker-compose.yml
```

---

## Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- A `.env` file in the project root (see [Environment Variables](#environment-variables) below)

### Run with Docker Compose

```bash
git clone https://github.com/anuragpatil1729/EDI_Parser_and_Validator.git
cd EDI_Parser_and_Validator

# Copy the example env file and fill in your values
cp .env.example .env

docker compose up --build
```

Open **http://localhost:3000** in your browser.

> On first run Docker pulls base images and installs dependencies — expect 2–3 minutes. Subsequent starts are fast.

### Stop the stack

```bash
docker compose down
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Ports (optional — defaults shown)
WEB_PORT=3000
API_PORT=4000
PARSER_PORT=8001
VALIDATOR_PORT=8002
AI_PORT=8003

# Frontend → API gateway
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# Service-to-service URLs (internal Docker network)
PARSER_URL=http://parser:8001
VALIDATOR_URL=http://validator:8002
AI_URL=http://ai:8003

# Supabase (optional — app works fully without this)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Gemini AI (optional — falls back to deterministic responses without this)
GEMINI_API_KEY=your-gemini-api-key

# Ollama (used for translation narratives; self-hosted)
OLLAMA_URL=http://localhost:11434
OLLAMA_TRANSLATION_TEACHER_MODEL=llama3
OLLAMA_MODEL=llama3
OLLAMA_TEMPERATURE=0.2

# If true, translation endpoint writes pseudo-label training examples to disk
TRANSLATION_COLLECT_TRAINING=false
```

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | **Yes** | URL of the API gateway, as seen by the browser |
| `SUPABASE_URL` | No | Supabase project URL for persistent storage |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Supabase service role key (bypasses RLS) |
| `GEMINI_API_KEY` | No | Google Gemini API key for AI explanations |
| `OLLAMA_URL` | No | Ollama base URL for translation narratives |
| `OLLAMA_TRANSLATION_TEACHER_MODEL` | No | Ollama model used for translation targets (teacher) |
| `OLLAMA_MODEL` | No | Fallback Ollama model name |
| `OLLAMA_TEMPERATURE` | No | Temperature for Ollama generation |
| `TRANSLATION_COLLECT_TRAINING` | No | Write pseudo-label translation examples to disk |

**Where to get keys:**
- Supabase: Dashboard → Project Settings → API Keys
- Gemini: [aistudio.google.com](https://aistudio.google.com) → Get API Key

---

## Supabase Setup (Optional)

To persist uploads and results across container restarts, run these queries in your Supabase SQL Editor:

```sql
-- Uploads table
create table if not exists public.edi_uploads (
  file_id     uuid primary key default gen_random_uuid(),
  file_name   text not null,
  content     text not null,
  uploaded_at timestamptz not null default now(),
  user_id     uuid references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- Parsed results
create table if not exists public.edi_parsed_results (
  file_id     uuid primary key references public.edi_uploads(file_id) on delete cascade,
  parsed_json jsonb not null,
  user_id     uuid references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Validation results
create table if not exists public.edi_validation_results (
  file_id         uuid primary key references public.edi_uploads(file_id) on delete cascade,
  validation_json jsonb not null,
  is_valid        boolean generated always as ((validation_json->>'is_valid')::boolean) stored,
  user_id         uuid references auth.users(id) on delete cascade,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Enable RLS (the service role key bypasses it from the backend)
alter table public.edi_uploads enable row level security;
alter table public.edi_parsed_results enable row level security;
alter table public.edi_validation_results enable row level security;

-- Recommended per-user policies
create policy "Users can read their uploads" on public.edi_uploads for select using (auth.uid() = user_id);
create policy "Users can insert their uploads" on public.edi_uploads for insert with check (auth.uid() = user_id);
create policy "Users can read parsed results" on public.edi_parsed_results for select using (auth.uid() = user_id);
create policy "Users can insert parsed results" on public.edi_parsed_results for insert with check (auth.uid() = user_id);
create policy "Users can update parsed results" on public.edi_parsed_results for update using (auth.uid() = user_id);
create policy "Users can read validation results" on public.edi_validation_results for select using (auth.uid() = user_id);
create policy "Users can insert validation results" on public.edi_validation_results for insert with check (auth.uid() = user_id);
create policy "Users can update validation results" on public.edi_validation_results for update using (auth.uid() = user_id);
```

Without Supabase configured the app uses in-memory storage — uploads are lost when the API container restarts.

---

## Supported Transaction Types

| Transaction | Description | Key Validation Rules |
|---|---|---|
| **837P** | Professional Claims | NM1 qualifiers, NM109 NPI format, CLM total vs SV1 sum, DOB before claim date |
| **837I** | Institutional Claims | Same as 837P |
| **835** | Remittance Advice | Required BPR, TRN, CLP segments; CLP01 format |
| **834** | Benefit Enrollment | Required BGN, INS segments; INS01 enum; REF02 format |

---

## API Reference

All endpoints are served by the Express API gateway on port `4000`.

### Upload File
```
POST /upload
Content-Type: multipart/form-data
Body: file (field name)

Response:
  { "fileId": "uuid" }
  { "batch": { "total_files": N, "file_ids": [...] } }   // for .zip uploads
```

### Parse EDI
```
POST /parse
Content-Type: application/json
Body: { "fileId": "uuid" }
   or { "raw_edi": "ISA*00*..." }

Response: { transaction_type, sender, receiver, date, segments[], loops[], metadata }
```

### Validate EDI
```
POST /validate
Content-Type: application/json
Body: { "transaction_type": "837", "segments": [...], "fileId": "uuid" }

Response: { is_valid, issues[], summary: { total, errors, warnings } }
```

### Translate (Narrative)
```
POST /translate
Content-Type: application/json
Body: {
  "transaction_type": "837|835|834",
  "parsed": { /* ParseResult */ },
  "issues": [ /* optional ValidationIssue[] */ ]
}

Response: {
  "transaction_type": "...",
  "sections": { "overview": {...}, "participants": {...}, "details": {...}, ... },
  "readable_walkthrough": "string",
  "issues_summary": { /* optional */ }
}
```

### AI Chat
```
POST /chat
Content-Type: application/json
Body: { "transaction_type": "837", "segment": "NM1", "error": "...", "value": "..." }

Response: { "explanation": "...", "suggested_fix": "..." }
```

### Health Checks
```
GET /health          → API gateway
GET :8001/health     → Parser service
GET :8002/health     → Validator service
GET :8003/health     → AI service
```

---

## Validation Checks

### Required Segments

Each transaction type enforces a set of required segments defined in `services/validator/app/rules/`.

### Format Checks

- **NPI** (`NM109`): must be exactly 10 numeric digits
- **Dates** (`DTP03`, `DMG02`): must follow `YYYYMMDD`
- **ZIP codes** (`N403`): must match `12345` or `12345-6789`

### Cross-Field Checks (837 only)

- **Claim total mismatch**: `CLM02` must equal the sum of all `SV1` line charges
- **DOB after claim date**: patient date of birth must precede the claim service date
- **Subscriber ID mismatch**: subscriber `NM109` must be consistent across all loops

### Code Checks

- **Unexpected NM1 qualifier**: `NM108` values outside `XX`, `34`, `24`, `MI` trigger a warning

---

## Sample Files

The following sample EDI files are included in `apps/web/public/sample-files/` and can be loaded directly from the Upload page:

| File | Type | Description |
|---|---|---|
| `valid_837.edi` | 837P | Clean professional claim — should validate with 0 errors |
| `invalid_837.edi` | 837P | Claim with bad NPI (5 digits) and missing CLM — triggers errors |
| `sample_835.edi` | 835 | Remittance with CLP, SVC, and CAS adjustment segments |
| `sample_834.edi` | 834 | Enrollment with 2 member records, INS and HD segments |

---

## Development

### Running Services Individually

```bash
# Frontend
npm --workspace apps/web run dev

# API gateway
npm --workspace apps/api run dev

# Python services (requires Python 3.11+)
bash scripts/run_all.sh
```

### Running Tests

```bash
# Parser tests
cd services/parser
python -m pytest tests/

# Validator tests
cd services/validator
python -m pytest tests/

# Test the parser directly
python scripts/test_parser.py
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 App Router, TypeScript, Tailwind CSS, lucide-react |
| API Gateway | Node.js, Express, TypeScript, Multer, adm-zip |
| Parser | Python 3.11, FastAPI, Pydantic |
| Validator | Python 3.11, FastAPI, JSON rule engine |
| AI Service | Python 3.11, FastAPI, httpx, Google Gemini 1.5 Flash |
| Database | Supabase (PostgreSQL) — optional |
| Infrastructure | Docker, Docker Compose |

---

## Roadmap

- [ ] 837I (Institutional) specific validation rules
- [ ] CARC / RARC code lookup in 835 remittance viewer
- [ ] NPI registry verification against CMS data
- [ ] ICD-10 and CPT code validity checks
- [ ] Batch processing dashboard for ZIP uploads
- [ ] Export validated/fixed EDI back to `.edi` file

---

## License

MIT License © 2026 Anurag Patil — see [LICENSE](LICENSE) for details.
