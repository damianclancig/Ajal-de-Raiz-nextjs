'use client'

import { Order } from '@/lib/models/OrderModel'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

const MyOrders = () => {
  const router = useRouter()
  const { data: orders, error } = useSWR('/api/orders/mine')
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return <></>

  if (error) return 'Ha ocurrido un error'
  if (!orders)
    return (
      <div className="flex flex-row min-h-screen justify-center items-center">
        <div className="loading loading-bars loading-lg"></div>
      </div>
    )
  return (
    <>
      <h2 className="text-3xl p-2 my-2 text-center bg-base-300 bg-opacity-20 backdrop-blur shadow-xl rounded-xl">
        Mis pedidos
      </h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra bg-base-100">
          <thead>
            <tr className="text-lg">
              <th>ID</th>
              <th>Fecha</th>
              <th className="w-24">Total</th>
              <th>Pagado</th>
              <th>Enviado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: Order) => (
              <tr key={order._id} className="text-nowrap text-base md:text-sm">
                <td>...{order._id.substring(20, 24)}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td className="text-right">{formatCurrency(order.totalPrice)}</td>
                <td>
                  {order.isPaid && order.paidAt ? `${order.paidAt.substring(0, 10)}` : 'Pendiente'}
                </td>
                <td>
                  {order.isDelivered && order.deliveredAt
                    ? `${order.deliveredAt.substring(0, 10)}`
                    : 'Pendiente'}
                </td>
                <td>
                  <Link
                    href={`/order/${order._id}`}
                    passHref
                    type="button"
                    className="btn btn-outline btn-sm"
                  >
                    Detalles
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
export default MyOrders
