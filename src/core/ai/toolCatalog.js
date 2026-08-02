export const toolCatalog = [
  {
    name: 'upload_contract',
    version: 'v0',
    summary: 'Upload a contract PDF and create a timeline draft.',
    endpoint: {
      method: 'POST',
      path: '/api/timeline',
      contentType: 'multipart/form-data',
    },
    inputSchema: {
      type: 'object',
      required: ['contract'],
      properties: {
        contract: {
          type: 'string',
          format: 'binary',
          description: 'PDF contract file',
        },
      },
    },
  },
  {
    name: 'get_timeline',
    version: 'v0',
    summary: 'Retrieve timeline entries and metadata for a transaction id.',
    endpoint: {
      method: 'GET',
      path: '/api/timeline/{id}',
    },
    inputSchema: {
      type: 'object',
      required: ['id'],
      properties: {
        id: {
          type: 'string',
          description: 'Transaction identifier returned by upload_contract',
        },
      },
    },
  },
  {
    name: 'export_timeline_pdf',
    version: 'v0',
    summary: 'Export reviewed timeline entries as a branded PDF.',
    endpoint: {
      method: 'POST',
      path: '/api/timeline/{id}/process',
      contentType: 'application/json',
    },
    inputSchema: {
      type: 'object',
      required: ['id', 'entries'],
      properties: {
        id: {
          type: 'string',
          description: 'Transaction identifier',
        },
        entries: {
          type: 'array',
          description: 'Reviewed timeline entries used to generate export',
          items: {
            type: 'object',
            additionalProperties: true,
          },
        },
      },
    },
  },
]

export const toolExecution = {
  method: 'POST',
  path: '/api/ai/tools/execute',
  contentType: 'application/json',
}
