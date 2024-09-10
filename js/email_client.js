const nodemailer = require('nodemailer');
const http = require('http');
const url = require('url');
const fetchSecret = require('./secretfetcher');

async function sendEmail(mailContents)
{
    const result = await fetchSecret();
    const secretJson = JSON.parse(result);
    const transporter = nodemailer.createTransport({
        service:'Gmail',
        auth: {
            user: secretJson['EmailUser'],
            pass: secretJson['EmailPass']
        }
    });
    const mailOptions = {
        from:secretJson['EmailUser'],
        to: secretJson['EmailRecipient'],
        subject: 'New bills charged',
        text:mailContents
    }

    const info = await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
