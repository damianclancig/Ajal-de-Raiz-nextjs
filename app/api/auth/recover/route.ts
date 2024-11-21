import dbConnect from '@/lib/dbConnect'
import { NextRequest } from 'next/server'
import UserModel from '@/lib/models/UserModel'
import crypto from 'crypto'
import sendEmail from '@/lib/sendEmail'
import validator from 'validator'

export const POST = async (request: NextRequest) => {
  const { email } = await request.json()
  if (!validator.isEmail(email)) {
    return Response.json({ message: 'El correo no es válido.' }, { status: 400 })
  }
  await dbConnect()

  try {
    // Verificar si el usuario existe
    const user = await UserModel.findOne({ email })
    if (!user) {
      return Response.json(
        { message: 'Si el correo existe, se enviará un enlace de recuperación.' },
        { status: 200 }
      )
    }

    // Generar un token de recuperación temporal
    const token = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    const tokenExpiry = Date.now() + 3600000 // Token válido por 1 hora

    // Guardar el token y su caducidad en el usuario
    user.resetPasswordToken = hashedToken
    user.resetPasswordExpires = tokenExpiry
    await user.save()

    // Enviar correo con el token de recuperación
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/reset-password?token=${token}`
    try {
      await sendEmail({
        to: email,
        subject: 'Recuperación de Contraseña',
        text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: ${resetUrl}`,
      })
    } catch (emailError) {
      return Response.json({ message: 'Error al enviar el correo.' + emailError }, { status: 500 })
    }

    return Response.json(
      { message: 'Si el correo existe, se enviará un enlace de recuperación.' },
      { status: 200 }
    )
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 })
  }
}
