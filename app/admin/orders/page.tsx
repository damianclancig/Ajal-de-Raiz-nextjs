import AdminLayout from '@/components/admin/AdminLayout'
import Orders from './Orders'

export const metadata = {
  title: 'Administrar pedidos',
}
const AdminOrdersPage = () => {
  return (
    <AdminLayout activeItem="orders">
      <h1 className="py-4 text-2xl">Pedidos</h1>
      <Orders />
    </AdminLayout>
  )
}

export default AdminOrdersPage
