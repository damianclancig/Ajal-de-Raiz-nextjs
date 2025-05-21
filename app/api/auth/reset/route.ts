import dbConnect from '@/lib/dbConnect'
import { NextRequest } from 'next/server'
import UserModel from '@/lib/models/UserModel'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import validator from 'validator'

export const POST = async (request: NextRequest) => {
  const { token, password, confirmPassword } = await request.json()

  // Validaciones básicas
  if (!token || !password || !confirmPassword) {
    return Response.json({ message: 'Todos los campos son requeridos.' }, { status: 400 })
  }

  if (password !== confirmPassword) {
    return Response.json({ message: 'Las contraseñas no coinciden.' }, { status: 400 })
  }

  console.log(`password: ${password}`)
  if (
    !validator.isStrongPassword(password, {
      minLength: 8, // Mínimo de 8 caracteres
      minLowercase: 1, // Al menos 1 letra minúscula
      minUppercase: 0, // Al menos 1 letra mayúscula
      minNumbers: 1, // Al menos 1 número
      minSymbols: 0, // No requiere símbolos
      returnScore: false, // No usar puntaje de fuerza
    })
  ) {
    return Response.json(
      { message: 'La contraseña debe tener al menos 8 caracteres, incluyendo letras y números.' },
      { status: 400 }
    )
  }

  await dbConnect()

  try {
    // Hash del token recibido para buscar en la base de datos
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    // Buscar el usuario con el token válido
    const user = await UserModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // Token no expirado
    })

    if (!user) {
      return Response.json({ message: 'El token es inválido o ha expirado.' }, { status: 400 })
    }

    // Actualizar la contraseña del usuario
    user.password = password
    user.resetPasswordToken = undefined // Limpiar el token
    user.resetPasswordExpires = undefined
    await user.save()

    return Response.json({ message: 'Contraseña actualizada correctamente.' }, { status: 200 })
  } catch (error: any) {
    return Response.json(
      { message: 'Error al actualizar la contraseña: ' + error.message },
      { status: 500 }
    )
  }
}
