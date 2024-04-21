'use client'

import { Order } from '@/lib/models/OrderModel'
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
  if (!orders) return 'Cargando...'
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>FECHA</th>
            <th>TOTAL</th>
            <th>PAGADO</th>
            <th>ENVIADO</th>
            <th>ACCIÓN</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: Order) => (
            <tr key={order._id}>
              <td>...{order._id.substring(20, 24)}</td>
              <td>{order.createdAt.substring(0, 10)}</td>
              <td>$ {order.totalPrice}</td>
              <td>
                {order.isPaid && order.paidAt ? `${order.paidAt.substring(0, 10)}` : 'Pendiente'}
              </td>
              <td>
                {order.isDelivered && order.deliveredAt
                  ? `${order.deliveredAt.substring(0, 10)}`
                  : 'Pendiente'}
              </td>
              <td>
                <Link href={`/order/${order._id}`} passHref>
                  Detalles
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default MyOrders
