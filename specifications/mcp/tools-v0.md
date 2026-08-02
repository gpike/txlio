# MCP Tool Catalog v0 (Txlio)

## Execution Adapter
Use the tool execution adapter to run catalog tools over JSON:

- Method: `POST /api/ai/tools/execute`
- Body shape: `{ "tool": "<name>", "input": { ... } }`

## `upload_contract`
Creates a timeline draft by processing a PDF contract.

- Method: `POST /api/timeline`
- Input: multipart form-data with `contract` (PDF)
- Output: timeline draft with `id`, `entries`, and metadata
- Execute adapter input:
	- `contractBase64` (required): base64 string of PDF content (data URL accepted)
	- `fileName` (optional): filename for uploaded contract

## `get_timeline`
Retrieves a processed timeline by transaction id.

- Method: `GET /api/timeline/{id}`
- Input: transaction id
- Output: timeline with entries and contract metadata
- Execute adapter input:
	- `id` (required): transaction id

## `export_timeline_pdf`
Exports reviewed timeline entries as a PDF.

- Method: `POST /api/timeline/{id}/process`
- Input: transaction id and reviewed entries
- Output: binary PDF response
- Execute adapter input:
	- `id` (required): transaction id
	- `entries` (required): reviewed entries array
- Execute adapter output:
	- JSON payload containing `mimeType`, `fileName`, and `contentBase64`
