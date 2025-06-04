import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import OrderModel from '@/lib/models/OrderModel'

export const PATCH = auth(async (...request: any) => {
  const [req, { params }] = request
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'unauthorized' }, { status: 401 })
  }
  try {
    await dbConnect()
    const { status } = await req.json()
    const order = await OrderModel.findById(params.id)
    if (!order) {
      return Response.json({ message: 'Pedido no encontrado' }, { status: 404 })
    }
    order.status = status
    await order.save()
    return Response.json({ message: 'Estado actualizado' })
  } catch (err: any) {
    return Response.json({ message: err.message }, { status: 500 })
  }
}) as any