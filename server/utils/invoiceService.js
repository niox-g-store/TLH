const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf-node');
const { invoiceGenerator } = require('../template/invoice');

exports.generateInvoice = async (qrArray, order, cart) => {
  try {
    const invoiceHtml = invoiceGenerator({ qrArray, order, cart });

    const file = { content: invoiceHtml };
    const options = {
      format: 'A4',
      margin: { top: '20px', bottom: '20px' },
    };

    const pdfBuffer = await pdf.generatePdf(file, options);

    const outputPath = path.join(__dirname, `../invoices/invoice-${order._id}.pdf`);
    fs.writeFileSync(outputPath, pdfBuffer);

    return outputPath; // or return buffer if you prefer
  } catch (err) {
    console.error('Invoice generation error:', err);
    throw new Error('Failed to generate invoice');
  }
};
