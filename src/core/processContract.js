const path = require('path')
const { extractTextFromPdf } = require('./readPdf')
const {
  buildTimelineEntries,
  extractPropertyAddress,
} = require('./timelineParser')
const { listOutputTemplates } = require('./outputTemplates')

async function processContract(filePath) {
  if (!filePath) {
    throw new Error('A PDF file path is required.')
  }

  const pdf = await extractTextFromPdf(filePath)

  if (!pdf.text.trim()) {
    throw new Error(
      'No machine-readable text found. Please ensure the PDF contains a Dates and Deadlines section.',
    )
  }

  const entries = buildTimelineEntries(pdf.pages, path.basename(filePath))
  const propertyAddress = extractPropertyAddress(pdf.pages)

  return {
    contractTitle: path.basename(filePath),
    pageCount: pdf.pageCount,
    entries,
    propertyAddress,
    outputTemplates: listOutputTemplates(),
  }
}

module.exports = {
  processContract,
}
