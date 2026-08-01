const fs = require('fs/promises')
const { extractTextFromPdfWithOcr } = require('./ocrPdf')

const MIN_CHARS_PER_PAGE = 100

function isTextSparse(pageCount, totalCharacters) {
  if (pageCount === 0) {
    return true
  }

  return totalCharacters / pageCount < MIN_CHARS_PER_PAGE
}

function roundPosition(value) {
  return Math.round(value * 10) / 10
}

function buildPageText(textContent) {
  const lineMap = new Map()

  textContent.items.forEach((item) => {
    if (!('str' in item) || !item.str?.trim()) {
      return
    }

    const [, , , , x, y] = item.transform
    const key = String(roundPosition(y))

    if (!lineMap.has(key)) {
      lineMap.set(key, [])
    }

    lineMap.get(key).push({
      text: item.str.trim(),
      x,
      y,
    })
  })

  const orderedLines = [...lineMap.values()]
    .sort((left, right) => right[0].y - left[0].y)
    .map((segments) =>
      segments
        .sort((left, right) => left.x - right.x)
        .map((segment) => segment.text)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .filter(Boolean)

  return {
    lines: orderedLines,
    text: orderedLines.join('\n'),
  }
}

async function extractTextFromPdf(filePath) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const buffer = await fs.readFile(filePath)
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise
  const pages = []

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const textContent = await page.getTextContent()
    const { lines, text } = buildPageText(textContent)

    pages.push({ pageNumber, lines, text })
  }

  const totalCharacters = pages.reduce((sum, page) => sum + page.text.length, 0)

  if (isTextSparse(pdf.numPages, totalCharacters)) {
    return extractTextFromPdfWithOcr(filePath)
  }

  return {
    pageCount: pdf.numPages,
    pages,
    text: pages.map((page) => page.text).join('\n\n'),
  }
}

module.exports = {
  extractTextFromPdf,
}
