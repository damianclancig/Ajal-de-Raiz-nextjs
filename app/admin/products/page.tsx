import AdminLayout from '@/components/admin/AdminLayout'
import Products from './Products'

export const metadata = {
  title: 'Administrar productos',
}
const AdminProductsPage = () => {
  return (
    <AdminLayout activeItem="products">
      <Products />
    </AdminLayout>
  )
}

export default AdminProductsPage
