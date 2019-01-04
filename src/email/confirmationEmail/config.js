import Mailgen from 'mailgen';

export const mailGenerator = new Mailgen({
  theme: 'salted',
  product: {
    name: 'DATANOMICS HOTELS',
    link: '#'
  }
});


export const emailGenerated = (name, url) => {
  return {
    body: {
      name: `${name}`,
      intro: 'Welcome to Datanomics! We\'re very excited to have you on board.',
      action: {
        instructions: 'To get started with Datanomics Hotel App, please click here:',
        button: {
          color: '#FC7166',
          text: 'Confirm your account',
          link: `${url}`
        }
      },
      outro: 'Need help, or have questions? Just contact Mrs Ogidan, we\'d love to help.'
    }
  };
};

