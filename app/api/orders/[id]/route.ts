import dbConnect from '@/lib/dbConnect'
import OrderModel from '@/lib/models/OrderModel'
import { auth } from '@/lib/auth'

export const GET = auth(async (...request: any) => {
  const [req, { params }] = request
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  await dbConnect()
  const order = await OrderModel.findById(params.id)
  return Response.json(order)
}) as any

export const PUT = auth(async (...request: any) => {
  const [req, { params }] = request
  const { paymentId } = await req.json()
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
    const order = await OrderModel.findById(params.id)
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: paymentId,
      status: 'approved',
    }
    const updatedOrder = await order.save()
    return Response.json(updatedOrder)
  } catch (error) {
    return Response.json(
      { message: error },
      {
        status: 500,
      }
    )
  }
}) as any
