# AI Engineering Kernel (Txlio)

This kernel is adapted from the VantageXL agent platform and scoped to Txlio's domain: contract ingestion, timeline extraction, review workflows, and PDF export.

## Purpose

- Define how AI tooling is designed and reviewed in this repo.
- Keep business logic in the domain core, not in AI adapters.
- Keep tool schemas compact, explicit, and auditable.
- Enforce deterministic behavior for consequential actions.

## Scope in Txlio

- Contract upload and extraction
- Timeline retrieval and edits
- Timeline export workflows
- AI-facing tool schema governance

## Required Reading

1. `docs/ai-engineering-kernel/agent-guardrails.md`
2. `docs/ai-engineering-kernel/mcp.md`
3. `docs/ai-engineering-kernel/tool-design.md`
4. `docs/ai-engineering-kernel/response-composition.md`
5. `docs/ai-engineering-kernel/ai-security.md`
6. `specifications/mcp/tools-v0.md`

## Implementation Notes

- The current tool catalog is exposed by `GET /api/ai/tools`.
- Tool metadata is maintained in `src/core/ai/toolCatalog.js`.
- Existing timeline endpoints remain the source of truth for execution.
