'use client'
import MercadoPagoButton from '@/components/MercadoPagoButton'
import { ProductsList } from '@/components/products/ProductsList'
import { PaymentMethodLogo } from '@/components/orders/PaymentMethodLogo'
import { OrderItem } from '@/lib/models/OrderModel'
import { formatCurrency, formatDate, optimizeImage } from '@/lib/utils'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

const OrderDetails = ({ orderId, paypalClientId }: { orderId: string; paypalClientId: string }) => {
  const paymentId = useSearchParams().get('payment_id')
  const status = useSearchParams().get('status')
  const { trigger: deliverOrder, isMutating: isDelivering } = useSWRMutation(
    `api/orders/${orderId}`,
    async (url) => {
      const res = await fetch(`/api/admin/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      res.ok ? toast.success('El pedido fue enviado') : toast.error(data.message)
    }
  )

  const { data: session } = useSession()

  function createPayPalOrder() {
    return fetch(`/api/orders/${orderId}/create-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((order) => order.id)
  }

  function onApprovePayPalOrder(data: any) {
    return fetch(`/api/orders/${orderId}/capture-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(() => {
        toast.success('El pedido fue pagado correctamente.')
      })
  }
  function onApproveMercadoPagoOrder() {
    return fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentId }),
    })
      .then((response) => response.json())
      .then(() => {
        toast.success('El pedido fue pagado correctamente.')
      })
  }
  useEffect(() => {
    if (status) onApproveMercadoPagoOrder()
  }, [status])

  const { data, error } = useSWR(`/api/orders/${orderId}`)

  if (error) return error.message
  if (!data)
    return (
      <div className="flex flex-row min-h-screen justify-center items-center">
        <div className="loading loading-bars loading-lg"></div>
      </div>
    )

  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt,
  } = data

  return (
    <div>
      <h1 className="text-2xl py-4 bg-base-300 bg-opacity-20 backdrop-blur shadow-xl rounded-xl px-4">
        Pedido N° {orderId}
      </h1>
      <div className="grid lg:grid-cols-4 gap-5 my-4 ">
        <div className="lg:col-span-3">
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">Dirección de envío</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                {shippingAddress.country}{' '}
              </p>
              {isDelivered ? (
                <div className="text-success">Enviado el {formatDate(deliveredAt)}</div>
              ) : (
                <div className="text-error">Pendiente de envío</div>
              )}
            </div>
          </div>

          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Método de pago</h2>
              <PaymentMethodLogo paymentMethod={paymentMethod} />
              {isPaid ? (
                <div className="text-success">Pagado el {formatDate(paidAt)}</div>
              ) : (
                <div className="text-error">Pendiente de pago</div>
              )}
            </div>
          </div>

          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <ProductsList items={items} />
            </div>
          </div>
        </div>

        <div>
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">Resumen del pedido</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Productos</div>
                    <div>{formatCurrency(itemsPrice)}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Impuestos</div>
                    <div>{formatCurrency(taxPrice)}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Envío</div>
                    <div>{formatCurrency(shippingPrice)}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>{formatCurrency(totalPrice)}</div>
                  </div>
                </li>

                {!isPaid && paymentMethod === 'PayPal' && (
                  <li>
                    <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                      <PayPalButtons
                        createOrder={createPayPalOrder}
                        onApprove={onApprovePayPalOrder}
                      />
                    </PayPalScriptProvider>
                  </li>
                )}

                {!isPaid && paymentMethod === 'MercadoPago' && (
                  <li>
                    <MercadoPagoButton orderId={orderId} />
                  </li>
                )}
                {session?.user.isAdmin && !isDelivered && (
                  <li>
                    <button
                      className="btn w-full my-2"
                      onClick={() => deliverOrder()}
                      disabled={isDelivering}
                    >
                      {isDelivering && <span className="loading loading-spinner"></span>}
                      Marcar como enviado
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default OrderDetails
