'use client'
import { Order } from '@/lib/models/OrderModel'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import useSWR from 'swr'

export default function Orders() {
  const { data: orders, error } = useSWR(`/api/admin/orders`)
  if (error) return 'Ha ocurrido un error'
  if (!orders) return 'Cargando...'

  return (
    <div>
      <h1 className="py-4 text-2xl">Pedidos</h1>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Pagado</th>
              <th>Enviado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: Order) => (
              <tr key={order._id}>
                <td>...{order._id.substring(20, 24)}</td>
                <td>{order.user?.name || 'Usuario eliminado'}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>{formatCurrency(order.totalPrice)}</td>
                <td>
                  {order.isPaid && order.paidAt ? `${formatDate(order.paidAt)}` : 'Pendiente'}
                </td>
                <td>
                  {order.isDelivered && order.deliveredAt
                    ? `${formatDate(order.deliveredAt)}`
                    : 'Pendiente'}
                </td>
                <td>
                  <Link
                    href={`/order/${order._id}?backTo=adminOrders`}
                    passHref
                    type="button"
                    className="btn btn-ghost btn-sm"
                  >
                    Detalles
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
