# Agent Guardrails

## Non-Negotiable Constraints

- Do not place timeline business rules in AI channel adapters.
- Do not leak internal OCR/parser internals in public tool outputs.
- Keep consequential actions idempotent when possible.
- Treat extraction as tentative until validated by authoritative workflow rules.
- Keep tool schemas compact, shallow, and strongly typed.
- Security, auditability, observability, and failure behavior are required for every tool.

## Development Approach

- API-first contracts
- Domain-first logic in `src/core`
- Thin adapters for AI/tool interfaces
- Explicit failure modes and typed error payloads

## Definition of Done

A change is complete only when:

- behavior is tested,
- contracts are documented,
- errors are explicit,
- telemetry/logging impact is considered,
- security implications are addressed,
- relevant docs are updated.
