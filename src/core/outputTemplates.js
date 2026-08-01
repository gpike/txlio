function formatMonthDay(isoDate) {
  if (!isoDate) {
    return ''
  }

  const parsed = new Date(`${isoDate}T00:00:00Z`)

  if (Number.isNaN(parsed.getTime())) {
    return isoDate
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(parsed)
}

function hasMeaningfulDate(value) {
  if (!value) {
    return false
  }

  return !/^(n\/?a|na|tbd)$/i.test(String(value).trim())
}

const REALTOR_TEMPLATES = {
  'Janelle McGill': {
    id: 'janelle-mcgill',
    label: 'Janelle McGill',
    realtorName: 'Janelle McGill',
    company: 'GREEN Realtor',
    title: 'Renovation Consultant',
    phone: '970.443.9188',
    email: 'janelle@jmcgillhomes.com',
    website: 'JMcGillHomes.com',
    buildContext: (payload) => {
      const { entries, contractTitle, propertyAddress } = payload
      const contractDateEntry =
        entries.find((entry) => /acceptance|effective/i.test(entry.title)) ||
        entries.find((entry) => entry.date)

      const contractDateStr = contractDateEntry ? contractDateEntry.date : ''
      const contractMonth = contractDateStr
        ? new Date(`${contractDateStr}T00:00:00Z`).toLocaleDateString('en-US', {
            month: 'long',
            timeZone: 'UTC',
          })
        : 'TBD'
      const contractDay = contractDateStr
        ? new Date(`${contractDateStr}T00:00:00Z`).getDate()
        : ''

      return {
        realtorName: 'Janelle McGill',
        company: 'GREEN Realtor',
        title: 'Renovation Consultant',
        phone: '970.443.9188',
        email: 'janelle@jmcgillhomes.com',
        website: 'JMcGillHomes.com',
        heading: 'YOUR CONTRACT DATES AND DEADLINES',
        propertyAddress:
          propertyAddress ||
          contractTitle.replace(/\.pdf$/i, '') ||
          'Property Address',
        contractDate: `${contractMonth} ${contractDay}`,
        rows: entries
          .filter((entry) => hasMeaningfulDate(entry.date))
          .map((entry) => ({
            reference: entry.contractReference || '',
            event: entry.title,
            date: formatMonthDay(entry.date),
          })),
      }
    },
  },
}

function listOutputTemplates() {
  return Object.values(REALTOR_TEMPLATES).map(({ id, label }) => ({
    id,
    label,
  }))
}

function getOutputTemplate(templateId) {
  const template = Object.values(REALTOR_TEMPLATES).find(
    (t) => t.id === templateId,
  )
  return template || Object.values(REALTOR_TEMPLATES)[0]
}

module.exports = {
  formatMonthDay,
  listOutputTemplates,
  getOutputTemplate,
}
