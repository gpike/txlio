const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')
const { getOutputTemplate } = require('./outputTemplates')

const HEADER_HOUSE_PATH = path.resolve(
  __dirname,
  '../../assets/header-house.png',
)

function drawAttachmentStyleHeader(doc, context, pageWidth) {
  const headerHeight = 132

  doc.rect(0, 0, pageWidth, headerHeight).fill('#eaedef')

  if (fs.existsSync(HEADER_HOUSE_PATH)) {
    const houseWidth = 126
    const houseHeight = 116
    const houseX = (pageWidth - houseWidth) / 2
    const houseY = 10

    doc.image(HEADER_HOUSE_PATH, houseX, houseY, {
      width: houseWidth,
      height: houseHeight,
    })
  }

  doc
    .font('Times-Bold')
    .fontSize(17)
    .fillColor('#3f4b53')
    .text(context.realtorName || 'Janelle McGill', 26, 48, { width: 214 })

  doc
    .font('Times-Roman')
    .fontSize(11)
    .fillColor('#3f4b53')
    .text('Realtor(R), GREEN,', 26, 74, { width: 214 })
    .text(context.title || 'Renovation Consultant', 26, 96, { width: 214 })

  doc
    .font('Times-Roman')
    .fontSize(11)
    .fillColor('#3f4b53')
    .text(context.phone || '970.443.9188', pageWidth - 244, 50, {
      width: 218,
      align: 'right',
    })
    .text(context.email || 'janelle@jmcgillhomes.com', pageWidth - 244, 72, {
      width: 218,
      align: 'right',
    })
    .text(context.website || 'JMcGillHomes.com', pageWidth - 244, 94, {
      width: 218,
      align: 'right',
    })

  doc
    .moveTo(0, 118)
    .lineTo(pageWidth, 118)
    .lineWidth(1.2)
    .strokeColor('#556975')
    .stroke()
  doc
    .moveTo(0, 122)
    .lineTo(pageWidth, 122)
    .lineWidth(1)
    .strokeColor('#93a2ab')
    .stroke()

  return 150
}

function drawRealtorTemplate(doc, context) {
  const margin = 54
  const pageWidth = 612
  const pageHeight = 792
  const contentWidth = pageWidth - margin * 2

  doc.y = drawAttachmentStyleHeader(doc, context, pageWidth)

  doc
    .fontSize(12)
    .fillColor('#000000')
    .text(context.heading, 0, doc.y, { width: pageWidth, align: 'center' })
  doc.moveDown(0.4)

  doc.fontSize(10).text(context.propertyAddress, 0, doc.y, {
    width: pageWidth,
    align: 'center',
  })
  doc
    .fontSize(9)
    .fillColor('#555555')
    .text(`Contract Date: ${context.contractDate}`, 0, doc.y, {
      width: pageWidth,
      align: 'center',
    })
  doc.moveDown(0.8)

  const colWidths = [50, 350, 80]
  const headerY = doc.y
  const headerHeight = 20

  doc
    .rect(margin, headerY, pageWidth - 2 * margin, headerHeight)
    .fillAndStroke('#f0f0f0', '#cccccc')

  doc.fontSize(9).fillColor('#000000')
  const headers = ['Contract\nReference', 'Event', 'Date or\nDeadline']
  let xPos = margin + 4

  headers.forEach((header, idx) => {
    doc.text(header, xPos, headerY + 2, {
      width: colWidths[idx] - 8,
      align: 'left',
    })
    xPos += colWidths[idx]
  })

  doc.y = headerY + headerHeight + 2

  context.rows.forEach((row, rowIdx) => {
    const currentY = doc.y
    const rowHeight = 18

    if (currentY + rowHeight > pageHeight - margin) {
      doc.addPage()
      doc.moveDown(1)
    }

    xPos = margin + 4

    doc.fontSize(9).fillColor('#000000')
    doc.text(row.reference, xPos, currentY, {
      width: colWidths[0] - 8,
      align: 'left',
    })

    xPos += colWidths[0]
    doc.text(row.event, xPos, currentY, {
      width: colWidths[1] - 8,
      align: 'left',
    })

    xPos += colWidths[1]
    doc.text(row.date, xPos, currentY, {
      width: colWidths[2] - 8,
      align: 'center',
    })

    if (rowIdx < context.rows.length - 1) {
      doc
        .moveTo(margin, currentY + rowHeight)
        .lineTo(pageWidth - margin, currentY + rowHeight)
        .strokeColor('#dddddd')
        .stroke()
    }

    doc.y = currentY + rowHeight
  })
}

async function exportTimelinePdf({
  outputPath,
  entries,
  contractTitle,
  sourceFile,
  templateId,
  propertyAddress,
}) {
  await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 0, size: 'LETTER' })
    const stream = fs.createWriteStream(outputPath)
    const template = getOutputTemplate(templateId)
    const context = template.buildContext({
      entries,
      contractTitle,
      sourceFile,
      propertyAddress,
    })

    stream.on('finish', resolve)
    stream.on('error', reject)
    doc.on('error', reject)

    doc.pipe(stream)
    drawRealtorTemplate(doc, context)
    doc.end()
  })
}

module.exports = {
  exportTimelinePdf,
}
