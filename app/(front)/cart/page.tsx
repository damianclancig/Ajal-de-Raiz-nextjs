import { Metadata } from 'next'
import CartDetails from './CartDetails'

export const metadata: Metadata = {
  title: 'Carrito de compras',
  description: 'Productos agregados en el carrito de compra.',
}

const CartPage = () => {
  return <CartDetails />
}

export default CartPage
