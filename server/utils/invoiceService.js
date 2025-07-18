const pdf = require('html-pdf-node');

const { invoiceGenerator } = require('../template/invoice');
const { productInvoiceGenerator } = require('../template/productInvoice');

exports.generateInvoice = async (qrArray, isProduct = false) => {
  try {
    const invoiceHtml = isProduct ? productInvoiceGenerator(qrArray) : invoiceGenerator(qrArray);

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
