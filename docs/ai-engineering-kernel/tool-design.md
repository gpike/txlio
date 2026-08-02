# Tool Design

A tool should:

- have one narrow purpose,
- require only necessary inputs,
- use explicit formats and enums,
- avoid deeply nested payloads,
- return machine-readable data and concise display guidance,
- expose recoverable typed errors,
- avoid hidden side effects.

Prefer:

- `upload_contract`
- `get_timeline`
- `export_timeline_pdf`

Avoid:

- `manage_everything`
