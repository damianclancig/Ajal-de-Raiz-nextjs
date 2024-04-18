import dbConnet from '@/lib/dbConnect'
import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import UserModel from '@/lib/models/UserModel'

export const POST = async (request: NextRequest) => {
  const { name, email, password } = await request.json()
  await dbConnet()
  const hashedPassword = await bcrypt.hash(password, 5)
  const newUser = new UserModel({
    name,
    email,
    password: hashedPassword,
  })

  try {
    await newUser.save()
    return Response.json({ message: 'El usuario se creó correctamente.' }, { status: 201 })
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 })
  }
}
