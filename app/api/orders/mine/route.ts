import { auth } from '@/lib/auth'
import dbConnet from '@/lib/dbConnect'
import OrderModel from '@/lib/models/OrderModel'

export const GET = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json({ message: 'unauthorized' }, { status: 401 })
  }

  const { user } = req.auth
  await dbConnet()
  const orders = await OrderModel.find({ user: user._id })
  return Response.json(orders)
}) as any
