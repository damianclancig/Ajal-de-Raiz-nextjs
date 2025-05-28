import { auth } from '@/lib/auth'
import OrderModel from '@/lib/models/OrderModel'
import MercadoPagoConfig, { Preference } from 'mercadopago'

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })
const isSandbox = process.env.APP_ENV !== 'production';

export const POST = auth(async (...request: any) => {
  const [req, { params }] = request
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const URL = `${baseUrl}/order/${params.id}`
  const order = await OrderModel.findById(params.id)
  if (order) {
    const cant = order.items.length
    const message = `Pedido de ${cant} producto${cant == 1 ? '' : 's'}`
    try {
      const preference = await new Preference(client).create({
        body: {
          items: [
            {
              id: params.id,
              title: message,
              quantity: 1,
              unit_price: order.totalPrice,
            },
          ],
          auto_return: 'approved',
          back_urls: {
            success: `${URL}`,
            failure: `${URL}`,
          },
        },
      })
      //   const captureData = await paypal.capturePayment(orderID)
      //   order.isPaid = true
      //   order.paidAt = Date.now()
      //   order.paymentResult = {
      //     id: captureData.id,
      //     status: captureData.status,
      //     email_address: captureData.payer.email_address,
      //   }
      //   const updatedOrder = await order.save()
      // res.status(200).send({ url: preference.sandbox_init_point })
      // return Response.json(preference.sandbox_init_point)
      const redirectUrl = isSandbox ? preference.sandbox_init_point : preference.init_point;
      return Response.json(redirectUrl);
    } catch (err: any) {
      return Response.json(
        { message: err.message },
        {
          status: 500,
        }
      )
    }
  } else {
    return Response.json(
      { message: 'Pedido no encontrado!' },
      {
        status: 404,
      }
    )
  }
}) as any
