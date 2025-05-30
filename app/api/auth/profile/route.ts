import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/lib/models/UserModel'
import bcrypt from 'bcryptjs'

export const PUT = auth(async (req) => {
  if (!req.auth) {
    return Response.json({ message: 'Not authenticated' }, { status: 401 })
  }
  const { user } = req.auth
  const { name, email, password } = await req.json()
  await dbConnect()

  try {
    console.log(`user: ${user._id}`)
    const dbUser = await UserModel.findById(user._id)
    if (!dbUser) {
      return Response.json(
        { message: 'User not found' },
        {
          status: 404,
        }
      )
    }
    dbUser.name = name
    dbUser.email = email
    if (typeof password === 'string' && password.trim() !== '') {
      dbUser.password = password
    }
    await dbUser.save()
    return Response.json({ message: 'User has been updated' })
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    )
  }
}) as any
