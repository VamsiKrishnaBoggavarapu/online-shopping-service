import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';

export const sendEmailTemplate = async ({
  from,
  to,
  subject,
  template,
  context,
}) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USERID,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const handlebarOptions = {
      viewEngine: {
        extName: '.handlebars',
        partialsDir: './emailTemplates',
        defaultLayout: false,
      },
      viewPath: './emailTemplates',
      extName: '.handlebars',
    };
    transporter.use('compile', hbs(handlebarOptions));

    const mailOptions = {
      from,
      to,
      subject,
      template,
      context,
    };

    return await transporter.sendMail(mailOptions);
  } catch (err) {
    throw err;
  }
};
