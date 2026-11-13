
import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({

    service:'gmail',
    auth:{
        type:'OAuth2',
        user:process.env.GOOGLE_CLIENT_USER,
        clientId:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRECT,
        refreshToken:process.env.GOOGLE_REFRESH_TOKEN
    }
})

transport.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});


export async function sendEmail({from,to,subject,text,html}){

  const mailOptions = {
        from: process.env.GOOGLE_CLIENT_USER,
        to,
        subject,
        html,
        text
    }

    const details = await transport.sendMail(mailOptions)
    console.log(details)
    return {
        success: true,
        message: 'Email sent successfully',
        messageId: details.messageId
    }

}





