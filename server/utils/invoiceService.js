const pdf = require('html-pdf-node');

const { invoiceGenerator } = require('../template/invoice');

exports.generateInvoice = async (qrArray) => {
  try {
    const invoiceHtml = invoiceGenerator(qrArray);

    const file = { content: invoiceHtml };
    const options = {
      format: 'A4',
      margin: { top: '20px', bottom: '20px' },
      printBackground: true,
    };

    const pdfBuffer = await pdf.generatePdf(file, options);

    return pdfBuffer; // or return buffer if you prefer
  } catch (err) {
    throw new Error(err);
  }
};
