const easyinvoice = require('easyinvoice');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const generateInvoiceNumber = (farmerId) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    const invoiceNumber = `${year}${month}${day}${hours}${minutes}${seconds}-${farmerId}`;
    return invoiceNumber;
};

const invoiceData = {
    documentTitle: 'Invoice',
    currency: 'INR',
    taxNotation: 'GST',
    marginTop: 25,
    marginRight: 25,
    marginLeft: 25,
    marginBottom: 25,
    sender: {
        company: 'Kiran Milk & Co.',
        address: 'Kathmandu, Nepal',
        email: 'kiran@gmail.com',
        phone: '8729008168',
    },
    client: {
        company: farmer.farmerName,
        phone: farmer.mobileNumber,
    },
    invoiceNumber: generateInvoiceNumber(farmerId),
    invoiceDate: date,
    products: [
        {
            description: 'Milk',
            quantity: 1,
            price: amountToPay,
        },
    ],
    bottomNotice:
        'Thank you for your payment. Please contact us if you have any questions.',
};

const result = await easyinvoice.createInvoice(invoiceData);

if (result.pdf == null) {
    throw new Error('Error generating invoice');
}

const pdfPath = `${__dirname}/../uploads/invoice.pdf`;
fs.writeFileSync(pdfPath, result.pdf, 'base64');

const data = new FormData();
data.append('file', fs.createReadStream(pdfPath));
data.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET);
data.append('cloud_name', process.env.CLOUDINARY_CLOUD_NAME);
data.append('resource_type', 'auto');

let uploadUrl;
await axios
    .post(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload`, data)
    .then((res) => {
        uploadUrl = res.data.secure_url;
    })
    .catch((err) => {
        throw err;
    });

fs.unlinkSync(pdfPath);

res.status(200).json({
    status: 'PAID',
    date,
    amount: dues,
    amountPaid: amountToPay,
    remainingDues: dues - amountToPay,
    remarks,
    invoiceUrl: uploadUrl,
});