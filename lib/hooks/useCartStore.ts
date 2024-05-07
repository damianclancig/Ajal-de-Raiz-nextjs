import { create } from 'zustand'
import { OrderItem, ShippingAddress } from '../models/OrderModel'
import { calcPrices } from '../utils'
import { persist } from 'zustand/middleware'

type Cart = {
  items: OrderItem[]
  itemsPrice: number
  taxPrice: number
  shippingPrice: number
  totalPrice: number
  paymentMethod: string
  shippingAddress: ShippingAddress
}

const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  taxPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
  paymentMethod: 'PayPal',
  shippingAddress: {
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  },
}

export const cartStore = create<Cart>()(persist(() => initialState, { name: 'cartStore' }))

export default function useCartService() {
  const { items, itemsPrice, taxPrice, shippingPrice, totalPrice, paymentMethod, shippingAddress } =
    cartStore()
  return {
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    shippingAddress,
    increase: (item: OrderItem) => {
      const exist = items.find((i) => i.slug === item.slug)
      const updateCartItems = exist
        ? items.map((i) => (i.slug === item.slug ? { ...exist, qty: exist.qty + 1 } : i))
        : [...items, { ...item, qty: 1 }]

      const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrices(updateCartItems)
      cartStore.setState({
        items: updateCartItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    },
    decrease: (item: OrderItem) => {
      const exist = items.find((i) => i.slug === item.slug)
      if (!exist) return
      const updateCartItems =
        exist.qty === 1
          ? items.filter((i: OrderItem) => i.slug !== item.slug)
          : items.map((i) => (i.slug === item.slug ? { ...exist, qty: exist.qty - 1 } : i))
      const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrices(updateCartItems)
      cartStore.setState({
        items: updateCartItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    },
    saveShippingAddress: (shippingAddress: ShippingAddress) => {
      cartStore.setState({ shippingAddress })
    },
    savePaymentMethod: (paymentMethod: string) => {
      cartStore.setState({ paymentMethod })
    },
    clear: () => {
      cartStore.setState({
        items: [],
      })
    },
    init: () => cartStore.setState(initialState),
  }
}
