import { Metadata } from 'next'
import MyOrders from './MyOrders'

export const metadata: Metadata = {
  title: 'Mis pedidos',
}

export default function page() {
  return (
    <>
      <h2 className="text-2xl py-2">Mis pedidos</h2>
      <MyOrders />
    </>
  )
}
