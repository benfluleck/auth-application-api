import sgMail from '@sendgrid/mail';

import { emailGenerated, mailGenerator } from './config'


let emailBody = (name, url) => mailGenerator.generate(emailGenerated(name, url));

let emailText = (name,url) => mailGenerator.generatePlaintext(emailGenerated(name, url));


export const sendConfirmationEmail = async (recipient, name, url) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: `${recipient}`,
    from: 'support@datanomics.com',
    subject: 'Confirmation Email for Staff- Do Not Reply',
    text: emailText(name,url),
    html: emailBody(name, url)
  };

  await sgMail.send(msg);
};
