import AdminLayout from '@/components/admin/AdminLayout'
import Form from './Form'

export function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Editar usuario ${params.id}`,
  }
}

export default function OrderHistory({ params }: { params: { id: string } }) {
  return (
    <AdminLayout activeItem="user">
      <Form userId={params.id} />
    </AdminLayout>
  )
}
