import AdminLayout from '@/components/admin/AdminLayout'
import { Metadata } from 'next'
import Form from './Form'

export const metadata: Metadata = {
  title: 'Crear producto',
}

function NewProduct() {
  return (
    <AdminLayout activeItem="products">
      <Form />
    </AdminLayout>
  )
}
export default NewProduct
