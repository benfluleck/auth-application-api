import sgMail from '@sendgrid/mail';

export const sendConfirmationEmail = async (recipient, name, url) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: `${recipient}`,
    from: 'support@datanomics.com',
    subject: 'Confirmation Email for Staff- Please Do Not Reply',
    text: 'This a Test Email from Benny',
    html: `<strong>
    Hi ${name},
    <p>This is the confirmation link</p>
    <a href="${url}">Confirm Email</a>
    </strong>`,
  };

  await sgMail.send(msg);
};
