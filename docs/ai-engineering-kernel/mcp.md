# MCP Adapter

MCP should expose selected Txlio capabilities to AI clients without embedding domain business logic.

## Rules

- Thin translation layer only
- No timeline business rules in the adapter
- No direct coupling to parser internals
- Compact input/output schemas
- Structured, machine-readable errors
- Tool versioning is explicit

## Current Mapping

- `upload_contract` -> `POST /api/timeline`
- `get_timeline` -> `GET /api/timeline/{id}`
- `export_timeline_pdf` -> `POST /api/timeline/{id}/process`
