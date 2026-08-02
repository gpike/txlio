# AI Security

Primary threats:

- prompt injection via uploaded contract content,
- malicious tool arguments,
- unauthorized cross-user access,
- duplicate consequential actions,
- deceptive success interpretation,
- data overexposure.

Controls:

- treat extracted text as untrusted data,
- validate all tool input,
- enforce policy outside model prompts,
- require identity and authorization,
- use idempotency where available,
- minimize returned sensitive data,
- audit sensitive actions and failures.
