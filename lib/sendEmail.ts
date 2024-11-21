import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  text: string
}

const sendEmail = async ({ to, subject, text }: EmailOptions) => {
  // Configura tu transporte de correo (SMTP) aquí.
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // O usa otro servicio de correo como SendGrid
    auth: {
      user: process.env.EMAIL_USER, // Correo de envío
      pass: process.env.EMAIL_PASS, // Contraseña o App Password
    },
  })

  const mailOptions = {
    from: process.env.EMAIL_USER, // Dirección de remitente
    to,
    subject,
    text,
  }

  // Enviar el correo
  await transporter.sendMail(mailOptions)
}

export default sendEmail
