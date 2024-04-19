import { Metadata } from 'next'
import OrderDetails from './OrderDetails'

export function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Pedido ${params.id}`,
  }
}

const page = ({ params }: { params: { id: string } }) => {
  return <OrderDetails orderId={params.id} paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'} />
}
export default page
