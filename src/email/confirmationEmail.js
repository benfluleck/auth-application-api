import sgMail from '@sendgrid/mail';

export const sendConfirmationEmail = async (recipient, url) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: `${recipient}`,
    from: 'bennytest@example.com',
    subject: 'Confirmation Email for Staff',
    text: 'This a Test Email from Benny',
    html: `<strong>
    <p>This is the confirmation link</p>
    <a href="${url}">Confirm Email</a>
    </strong>`,
  };

  await sgMail.send(msg);
};
