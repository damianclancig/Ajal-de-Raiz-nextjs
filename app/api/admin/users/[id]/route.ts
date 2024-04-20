import { auth } from '@/lib/auth'
import UserModel from '@/lib/models/UserModel'
import dbConnect from '@/lib/dbConnect'

export const DELETE = auth(async (...args: any) => {
  const [req, { params }] = args
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }

  try {
    await dbConnect()
    const user = await UserModel.findById(params.id)
    if (user) {
      if (user.isAdmin)
        return Response.json(
          { message: 'El usuario es Admin' },
          {
            status: 400,
          }
        )
      await user.deleteOne()
      return Response.json({ message: 'Usuario eliminado' })
    } else {
      return Response.json(
        { message: 'Usuario no encontrado' },
        {
          status: 404,
        }
      )
    }
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    )
  }
}) as any
