'use client'
import { Order } from '@/lib/models/OrderModel'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import useSWR from 'swr'
import { useState } from 'react'

export default function Orders() {
  const { data: orders, error } = useSWR(`/api/admin/orders`)
  const [showModal, setShowModal] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  // Simula la función de eliminar (debes reemplazarla por tu lógica real)
  const handleDelete = async () => {
    // Aquí va tu lógica para eliminar la orden con selectedOrderId
    setShowModal(false)
    setSelectedOrderId(null)
    // Puedes recargar los datos o mostrar un mensaje de éxito
  }

  if (error) return 'Ha ocurrido un error'
  if (!orders)
    return (
      <div className="flex flex-row min-h-screen justify-center items-center">
        <div className="loading loading-bars loading-lg"></div>
      </div>
    )

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra bg-base-100">
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
              <td>{order.isPaid && order.paidAt ? `${formatDate(order.paidAt)}` : 'Pendiente'}</td>
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
                  className="btn btn-outline btn-sm mr-2"
                >
                  Detalles
                </Link>
                <button
                  type="button"
                  className="btn btn-outline btn-error btn-sm"
                  onClick={() => {
                    setSelectedOrderId(order._id)
                    setShowModal(true)
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Fondo que respeta el modo oscuro/claro */}
          <div className="absolute inset-0 bg-base-200 bg-opacity-70 transition-colors"></div>
          <div className="relative bg-base-100 rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-4">¿Está seguro que desea eliminar este pedido?</h2>
            <div className="flex justify-evenly w-full mt-4">
              <button
                className="btn btn-error"
                onClick={handleDelete}
              >
                Sí
              </button>
              <button
                className="btn"
                onClick={() => setShowModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
