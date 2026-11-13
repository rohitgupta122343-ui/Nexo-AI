import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRECT, // Wahi spelling jo aapne pehle rakhi thi
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

export async function sendEmail({ from, to, subject, text, html }) {
  try {
    const sender = process.env.GOOGLE_CLIENT_USER;
    const messageBody = html || text;

    // Email ko RFC 2822 format mein banayein
    const emailLines = [
      `From: ${sender}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=utf-8',
      '',
      messageBody,
    ];

    const email = emailLines.join('\r\n');

    // Base64URL encode karein (Gmail API ki requirement)
    const encodedMessage = Buffer.from(email)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log('Email sent via Gmail API:', res.data);
    return {
      success: true,
      message: 'Email sent successfully',
      messageId: res.data.id,
    };
  } catch (error) {
    console.error('Error sending email via Gmail API:', error);
    throw error;
  }
}