
// import nodemailer from 'nodemailer'

// const transport = nodemailer.createTransport({

//     service:'gmail',
//     auth:{
//         type:'OAuth2',
//         user:process.env.GOOGLE_CLIENT_USER,
//         clientId:process.env.GOOGLE_CLIENT_ID,
//         clientSecret:process.env.GOOGLE_CLIENT_SECRECT,
//         refreshToken:process.env.GOOGLE_REFRESH_TOKEN
//     }
// })

// transport.verify((error, success) => {
//   if (error) {
//     console.error('Error connecting to email server:', error);
//   } else {
//     console.log('Email server is ready to send messages');
//   }
// });


// export async function sendEmail({from,to,subject,text,html}){

//   const mailOptions = {
//         from: process.env.GOOGLE_CLIENT_USER,
//         to,
//         subject,
//         html,
//         text
//     }

//     const details = await transport.sendMail(mailOptions)
//     console.log(details)
//     return {
//         success: true,
//         message: 'Email sent successfully',
//         messageId: details.messageId
//     }

// }



import {
    TransactionalEmailsApi,
    TransactionalEmailsApiApiKeys,
    SendSmtpEmail
} from '@getbrevo/brevo'

const api = new TransactionalEmailsApi()

api.setApiKey(
    TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
)

export async function sendEmail({to, subject, text, html}) {
    try {
        const email = new SendSmtpEmail()

        email.sender = {
            email: process.env.BREVO_SENDER_EMAIL,
            name: 'Nexo AI'
        }

        email.to = [{email: to}]
        email.subject = subject
        email.htmlContent = html
        email.textContent = text

        const response = await api.sendTransacEmail(email)

        console.log('Email sent:', response.body)

        return {
            success: true,
            message: 'Email sent successfully',
            messageId: response.body?.messageId
        }

    } catch (error) {
        console.error('Email error:', error.response?.body || error)
        throw error
    }
}

