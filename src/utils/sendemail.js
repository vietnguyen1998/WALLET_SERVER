var nodemailer = require('nodemailer');

const sendMail = async (toEmail, text) => {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'lekhangtrumpro@gmail.com',
            pass: 'nguyenlekhang11'
        }
    });

    let mailOptions = {
        from: 'lekhangtrumpro@gmail.com',
        to: toEmail,
        subject: 'Gui mat khau moi',
        text: text
    }
    let result =null
     await transporter.sendMail(mailOptions).then(info => {
        if (info.messageId !==null) {
            result =true;
        } else {
            console.log( info.response);
            result= false;
        }
    });
    return result;
}


module.exports = {
    sendMail
};