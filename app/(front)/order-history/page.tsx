import { Metadata } from 'next'
import MyOrders from './MyOrders'

export const metadata: Metadata = {
  title: 'Mis pedidos',
}

export default function page() {
  return <MyOrders />
}
