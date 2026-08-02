# Response Composition

Downstream responses should be normalized before reaching an AI model.

Remove:

- parser implementation details,
- duplicate textual content,
- irrelevant metadata,
- transient internal identifiers not needed by users.

Preserve:

- authoritative transaction identifiers,
- event names and dates,
- source snippets for auditability,
- validation flags,
- export confirmation state,
- safe recovery guidance.
