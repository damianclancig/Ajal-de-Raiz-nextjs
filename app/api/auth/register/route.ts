import dbConnet from '@/lib/dbConnect'
import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import UserModel from '@/lib/models/UserModel'

export const POST = async (request: NextRequest) => {
  const { name, email, password } = await request.json()
  if (!name || !email || !password) {
    return Response.json({ message: 'Todos los campos son obligatorios.' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return Response.json({ message: 'El correo electrónico no es válido.' }, { status: 400 })
  }

  if (password.length < 8) {
    return Response.json(
      { message: 'La contraseña debe tener al menos 8 caracteres.' },
      { status: 400 }
    )
  }

  await dbConnet()

  const existingUser = await UserModel.findOne({ email })
  if (existingUser) {
    return Response.json({ message: 'El correo electrónico ya está registrado.' }, { status: 409 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = new UserModel({
    name,
    email,
    password: hashedPassword,
  })

  try {
    await newUser.save()
    return Response.json(
      { message: 'Usuario registrado exitosamente.', user: { name, email } },
      { status: 201 }
    )
  } catch (error: any) {
    if (error.code === 11000) {
      return Response.json(
        { message: 'El correo electrónico ya está registrado.' },
        { status: 409 }
      )
    }
    return Response.json({ message: 'Error interno del servidor.' }, { status: 500 })
  }
}
