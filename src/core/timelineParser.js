const MONTHS = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
}

const ABSOLUTE_DATE_PATTERN =
  /\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{2,4})\b/gi
const RELATIVE_DATE_PATTERN =
  /\b(?:within\s+)?(\d{1,3})\s+(business\s+)?days?\s+(after|from)\s+([^.;\n]+)/gi
const SECTION_START_PATTERN = /dates, deadlines and applicability/i
const SECTION_END_PATTERN = /^\d+\.\s+[A-Z][A-Za-z/& ,'-]+/
// OCR pages prefix paragraphs with 3-digit line numbers + a section reference like "457 8.7."
// The Dates/Deadlines table is in §3; end the section only when we reach §4 or higher
// (e.g. "148 4. PURCHASE PRICE" or "457 8.7. Right to Object").
// "122 3.1. Dates and Deadlines." must NOT trigger section end, so we require [4-9] or 2+ digits.
const OCR_BODY_LINE_PATTERN = /^\d{3,}\s+(?:[4-9]|\d{2,})\./
const SECTION_ROW_PATTERN =
  /^\d+\s+§\s+\d+\s+(.+?)\s+(\d{1,2}\/\d{1,2}\/\d{2,4}|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{2,4}|N\/A|NA|TBD)$/i
// Matches OCR-mangled pipe-delimited table rows:
//   "[3 §5 | Record Title Deadline | May 5, 2026 |"
//   "[35 [510 | Property Insurance Termination Deadline [May 22, 2026"
const DATE_VALUE_PATTERN =
  /\d{1,2}\/\d{1,2}\/\d{2,4}|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{2,4}|\bN\/A\b|\bNA\b|\bTBD\b/i
// Noise snippet patterns for the absolute-date fallback parser
const NOISE_SNIPPET_PATTERNS = [
  /\bprior to\b/i, // historical legal references (e.g. prior to January 1, 1978)
  /\badoption\s+date\b/i, // form metadata
  /\bmandatory\s+use\s+date\b/i, // form metadata
]

function normalizeEventText(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/^date or deadline\s+/i, '')
    .replace(/^event\s+/i, '')
    .trim()
}

function formatTitleFromSection(event) {
  return event
    .replace(/\bdate\b/gi, 'date')
    .replace(/\bdeadline\b/gi, 'deadline')
    .replace(/\bdelivery\b/gi, 'Delivery')
    .replace(/\bdocuments\b/gi, 'Documents')
    .replace(/\bnew\b/gi, 'New')
    .replace(/\bloan\b/gi, 'Loan')
    .replace(/\bassociation\b/gi, 'Association')
    .replace(/\bdue diligence\b/gi, 'Due diligence')
    .replace(/\btitle\b/gi, 'Title')
    .replace(/\binspection\b/gi, 'Inspection')
    .replace(/\bappraisal\b/gi, 'Appraisal')
    .replace(/\bclosing\b/gi, 'Closing')
    .replace(/\bpossession\b/gi, 'Possession')
    .replace(/\bacceptance\b/gi, 'Acceptance')
}

function normalizeYear(year) {
  if (year.length === 2) {
    return Number(year) + 2000
  }

  return Number(year)
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10)
}

function parseAbsoluteDate(text) {
  const slash = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/)

  if (slash) {
    const monthNum = Number(slash[1])
    const dayNum = Number(slash[2])
    // Reject out-of-range values — these come from legal citation numbers like § 38-30-113
    if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
      return null
    }
    const month = monthNum - 1
    const day = dayNum
    const year = normalizeYear(slash[3])
    const parsed = new Date(Date.UTC(year, month, day))

    if (!Number.isNaN(parsed.getTime())) {
      return parsed
    }
  }

  const long = text.match(
    /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{2,4})$/i,
  )

  if (!long) {
    return null
  }

  const dayNum = Number(long[2])
  if (dayNum < 1 || dayNum > 31) {
    return null
  }

  const parsed = new Date(
    Date.UTC(normalizeYear(long[3]), MONTHS[long[1].toLowerCase()], dayNum),
  )
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function detectEventType(snippet) {
  const lower = snippet.toLowerCase()

  if (lower.includes('closing')) {
    return 'closing'
  }

  if (lower.includes('earnest')) {
    return 'earnest-money'
  }

  if (lower.includes('option')) {
    return 'option-period'
  }

  if (lower.includes('inspection')) {
    return 'inspection'
  }

  if (lower.includes('financing') || lower.includes('loan')) {
    return 'financing'
  }

  if (lower.includes('appraisal')) {
    return 'appraisal'
  }

  if (lower.includes('title')) {
    return 'title'
  }

  if (lower.includes('possession')) {
    return 'possession'
  }

  if (lower.includes('effective') || lower.includes('acceptance')) {
    return 'effective-date'
  }

  return 'contract-event'
}

function normalizeTemplateDate(dateText) {
  const rawValue = dateText.trim()
  const parsedDate = parseAbsoluteDate(rawValue)

  if (!parsedDate) {
    return {
      date: '',
      requiresReview: true,
      notes: `Unresolved section value: ${rawValue}`,
    }
  }

  return {
    date: toIsoDate(parsedDate),
    requiresReview: false,
    notes: '',
  }
}

function buildTitle(eventType, snippet) {
  const titles = {
    closing: 'Closing date',
    'earnest-money': 'Earnest money deadline',
    'option-period': 'Option period milestone',
    inspection: 'Inspection deadline',
    financing: 'Financing milestone',
    appraisal: 'Appraisal milestone',
    title: 'Title deadline',
    possession: 'Possession date',
    'effective-date': 'Effective date',
    'contract-event': 'Contract milestone',
  }

  return titles[eventType] || snippet.slice(0, 70)
}

function splitIntoSnippets(text) {
  return text
    .split(/(?<=[.;])\s+|\n+/)
    .map((snippet) => snippet.trim())
    .filter(Boolean)
}

function extractDatesSectionLines(pages) {
  const sectionLines = []
  let inSection = false

  pages.forEach((page) => {
    const lines = Array.isArray(page.lines)
      ? page.lines
      : splitIntoSnippets(page.text)

    lines.forEach((line) => {
      const trimmed = line.trim()

      if (!trimmed) {
        return
      }

      if (!inSection && SECTION_START_PATTERN.test(trimmed)) {
        inSection = true
        return
      }

      if (!inSection) {
        return
      }

      if (
        (SECTION_END_PATTERN.test(trimmed) ||
          OCR_BODY_LINE_PATTERN.test(trimmed)) &&
        !SECTION_START_PATTERN.test(trimmed)
      ) {
        inSection = false
        return
      }

      sectionLines.push({
        pageNumber: page.pageNumber,
        text: trimmed,
      })
    })
  })

  return sectionLines
}

function findSectionEntries(pages, contractTitle) {
  const lines = extractDatesSectionLines(pages)
  const entries = []
  let tempIndex = 0

  lines.forEach((line) => {
    // OCR table rows start with [ or | (OCR'd table borders); body prose starts with 3-digit line numbers.
    // For table rows, bypass the keyword guard since OCR may have mangled "deadline" etc.
    const isTableRow = /^[\[|]/.test(line.text)

    if (!isTableRow && !/date|deadline/i.test(line.text)) {
      return
    }

    if (/item no\.|reference|date or deadline|event/i.test(line.text)) {
      return
    }

    let event = null
    let rawDate = null

    const match = line.text.match(SECTION_ROW_PATTERN)
    if (match) {
      event = normalizeEventText(match[1])
      rawDate = match[2]
    } else if (line.text.includes('|')) {
      // OCR pipe-delimited format: "[3 §5 | Event Name | May 5, 2026 |"
      // OCR sometimes renders | as [ so some rows have only [ as delimiters.
      const parts = line.text
        .split('|')
        .map((p) => p.replace(/[\[\]{}]/g, '').trim())
        .filter(Boolean)
      // parts[0] = "3 §5", parts[1] = event name, parts[2] = date (if 3+ parts)
      // or parts[0] = event name + date merged when row-number prefix was on previous line
      const namePart = parts.length >= 2 ? parts[1] : parts[0]
      const datePart = parts.find((p) => DATE_VALUE_PATTERN.test(p))
      const hasKeyword =
        /deadline|date|period|delivery|closing|possession|termination/i.test(
          namePart,
        )
      if (namePart && datePart && (isTableRow || hasKeyword)) {
        rawDate = datePart.match(DATE_VALUE_PATTERN)?.[0]
        // Strip the date value out of the event name (OCR often merges them into one part)
        // Also strip leading row-number prefixes like "56 " or "® §10 "
        event = normalizeEventText(
          namePart
            .replace(DATE_VALUE_PATTERN, '')
            .replace(/^\d+\s+/, '')
            .replace(/^[^a-zA-Z]*§?\s*\d+\s+/, '')
            .trim(),
        )
      }
    } else {
      // Also try: a line that ends with a date (no pipes, OCR run-together)
      const endDate = line.text.match(
        new RegExp(`(.+?)\\s+\\[?(${DATE_VALUE_PATTERN.source})\\]?\\s*$`, 'i'),
      )
      if (
        endDate &&
        (isTableRow ||
          /deadline|date|period|delivery|closing|possession|termination/i.test(
            endDate[1],
          ))
      ) {
        event = normalizeEventText(
          endDate[1].replace(/^\[?\d+\]?\s+\[?(?:§\s*)?\d+\]?\s*/, ''),
        )
        rawDate = endDate[2]
      }
    }

    if (!event || !rawDate) {
      return
    }

    const normalized = normalizeTemplateDate(rawDate)
    const eventType = detectEventType(event)

    entries.push({
      id: `${slugify(contractTitle)}-section-${line.pageNumber}-${tempIndex}-${slugify(event)}`,
      title: formatTitleFromSection(event),
      date: normalized.date,
      eventType,
      contractReference: '',
      sourceSnippet: line.text,
      sourcePageNumber: line.pageNumber,
      confidence: normalized.requiresReview ? 0.66 : 0.97,
      dependsOn: '',
      notes: normalized.notes,
      requiresReview: normalized.requiresReview,
    })

    tempIndex += 1
  })

  entries.sort((left, right) => {
    if (!left.date && !right.date) {
      return left.title.localeCompare(right.title)
    }

    if (!left.date) {
      return 1
    }

    if (!right.date) {
      return -1
    }

    return left.date.localeCompare(right.date)
  })

  entries.forEach((entry, index) => {
    entry.contractReference = `3.${index + 1}`
  })

  return entries
}

// Matches page-header/footer lines injected by DigiSign or PDF viewers
const PAGE_HEADER_PATTERN = /\bpage\s+\d+\s+of\s+\d+\b/i
// Matches legal section citation numbers (e.g. § 38-30-113, C.R.S. § 25-11-114)
const LEGAL_CITATION_PATTERN = /§\s*\d+[-–]\d+[-–]\d+/

function findAbsoluteEntries(page, contractTitle) {
  const snippets = splitIntoSnippets(page.text)
  const entries = []

  snippets.forEach((snippet, index) => {
    if (
      PAGE_HEADER_PATTERN.test(snippet) ||
      LEGAL_CITATION_PATTERN.test(snippet)
    ) {
      return
    }

    if (NOISE_SNIPPET_PATTERNS.some((p) => p.test(snippet))) {
      return
    }

    // Skip signature-only lines: "First Last MM/DD/YYYY" with no deadline context
    if (
      /^[A-Z][a-z]+ [A-Z](?:[a-z]+ )?[A-Z][a-z]+ \d{2}\/\d{2}\/\d{4}$/.test(
        snippet,
      ) &&
      !/deadline|closing|inspection|appraisal|title|possession|earnest|financing/i.test(
        snippet,
      )
    ) {
      return
    }

    const matches = snippet.match(ABSOLUTE_DATE_PATTERN)

    if (!matches) {
      return
    }

    matches.forEach((match) => {
      const parsedDate = parseAbsoluteDate(match)

      if (!parsedDate) {
        return
      }

      const eventType = detectEventType(snippet)
      const title = buildTitle(eventType, snippet)

      entries.push({
        id: `${slugify(contractTitle)}-${page.pageNumber}-${index}-${slugify(title)}-${toIsoDate(parsedDate)}`,
        title,
        date: toIsoDate(parsedDate),
        eventType,
        sourceSnippet: snippet,
        sourcePageNumber: page.pageNumber,
        confidence: 0.82,
        dependsOn: '',
        notes: '',
        requiresReview: false,
      })
    })
  })

  return entries
}

function findRelativeEntries(page, contractTitle) {
  const entries = []
  let match
  let index = 0

  while ((match = RELATIVE_DATE_PATTERN.exec(page.text)) !== null) {
    const days = Number(match[1])
    const business = Boolean(match[2])
    const reference = match[4].trim()
    const snippet = match[0].trim()
    const eventType = detectEventType(snippet)
    const title = `${buildTitle(eventType, snippet)} (${days} ${business ? 'business ' : ''}days ${match[3]})`

    entries.push({
      id: `${slugify(contractTitle)}-${page.pageNumber}-relative-${index}`,
      title,
      date: '',
      eventType,
      sourceSnippet: snippet,
      sourcePageNumber: page.pageNumber,
      confidence: 0.58,
      dependsOn: reference,
      notes: `Relative deadline: ${days} ${business ? 'business ' : ''}days ${match[3]} ${reference}.`,
      requiresReview: true,
    })

    index += 1
  }

  return entries
}

function deduplicate(entries) {
  const seen = new Set()

  return entries.filter((entry) => {
    const key = [
      entry.title,
      entry.date,
      entry.eventType,
      entry.sourcePageNumber,
    ].join('|')

    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

function buildTimelineEntries(pages, contractTitle) {
  const sectionEntries = findSectionEntries(pages, contractTitle)
  const sectionDates = new Set(
    sectionEntries.map((e) => e.date).filter(Boolean),
  )

  // Always run absolute/relative extraction and include entries for dates NOT already in the section
  const allEntries = pages.flatMap((page) => [
    ...findAbsoluteEntries(page, contractTitle),
    ...findRelativeEntries(page, contractTitle),
  ])
  const supplemental = allEntries.filter(
    (e) => e.date && !sectionDates.has(e.date),
  )

  const combined = [...sectionEntries, ...supplemental]

  const sortFn = (left, right) => {
    if (!left.date && !right.date) return left.title.localeCompare(right.title)
    if (!left.date) return 1
    if (!right.date) return -1
    return left.date.localeCompare(right.date)
  }

  return deduplicate(combined).sort(sortFn)
}

function extractPropertyAddress(pages) {
  if (!pages || pages.length === 0) {
    return ''
  }

  const searchPages = pages.slice(0, 3)
  const searchText = searchPages.map((p) => p.text).join('\n')
  const lines = searchPages.flatMap((p) =>
    Array.isArray(p.lines) ? p.lines : p.text.split('\n'),
  )

  function cleanAddress(text) {
    return String(text)
      .replace(/\s+/g, ' ')
      .replace(/[•·]/g, ' ')
      .replace(/^[:,\-\s]+/, '')
      .trim()
  }

  // Preferred extraction for Colorado contracts:
  // "known as: 91 Grays Ln Severance CO 80550" followed by
  // "Street Address City State Zip".
  const knownAsInline = searchText.match(
    /known\s+as\s*:\s*([^\n]+?)\s*(?:Street\s+Address\s+City\s+State\s+Zip|County\s+of|\.\s|\n)/i,
  )

  if (knownAsInline && knownAsInline[1]) {
    const address = cleanAddress(knownAsInline[1])
    if (address.length > 8) {
      return address
    }
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = String(lines[index]).trim()

    if (!/known\s+as\s*:/i.test(line)) {
      continue
    }

    const afterColon = cleanAddress(line.replace(/.*known\s+as\s*:/i, ''))

    if (
      afterColon &&
      !/^[,.;-]+$/.test(afterColon) &&
      !/street\s+address\s+city\s+state\s+zip/i.test(afterColon)
    ) {
      return afterColon
    }

    // In many forms the full property address is the line immediately
    // above "known as:" and the value after the colon is blank or punctuation.
    const previousLine = cleanAddress(lines[index - 1] || '')
    if (
      previousLine &&
      /\b[A-Z]{2}\b\s+\d{5}(?:-\d{4})?\b/.test(previousLine)
    ) {
      return previousLine
    }

    // If address is wrapped to the next line, read it from there.
    const nextLine = cleanAddress(lines[index + 1] || '')
    if (nextLine && !/street\s+address\s+city\s+state\s+zip/i.test(nextLine)) {
      return nextLine
    }
  }

  const patterns = [
    /(?:subject\s+)?property\s+address\s*[:\-]?\s*([^\n]+)/i,
    /(?:subject\s+)?property\s*[:\-]\s*([^\n]+)/i,
  ]

  for (const pattern of patterns) {
    const match = searchText.match(pattern)
    if (!match || !match[1]) {
      continue
    }

    const address = cleanAddress(match[1])
    if (
      address.length > 8 &&
      !/^(the|a|an|contract|agreement|herein)/i.test(address)
    ) {
      return address
    }
  }

  return ''
}

module.exports = {
  buildTimelineEntries,
  parseAbsoluteDate,
  extractPropertyAddress,
}
