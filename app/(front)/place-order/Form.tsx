'use client'
import CheckoutSteps from '@/components/CheckoutSteps'
import { ProductsList } from '@/components/products/ProductsList'
import useCartService from '@/lib/hooks/useCartStore'
import { formatCurrency, freeShippingCost, optimizeImage } from '@/lib/utils'
import { faTruck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import useSWRMutation from 'swr/mutation'

const Form = () => {
  const router = useRouter()
  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    clear,
  } = useCartService()
  const { trigger: placeOrder, isMutating: isPlacing } = useSWRMutation(
    `/api/orders/mine`,
    async (url) => {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod,
          shippingAddress,
          items,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        clear()
        toast.success('El pedido se cargó correctamente')
        return router.push(`/order/${data.order._id}`)
      } else {
        toast.error(data.message)
      }
    }
  )
  useEffect(() => {
    if (!paymentMethod) {
      return router.push('/payment')
    }
    if (items.length === 0) {
      return router.push('/')
    }
  }, [paymentMethod, router])

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <></>

  return (
    <div>
      <CheckoutSteps current={4} />
      <div className="grid lg:grid-cols-4 gap-5 my-4">
        <div className="overflow-x-auto lg:col-span-3">
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title text-2xl">Dirección de envío</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                {shippingAddress.country}{' '}
              </p>
              <div>
                <Link className="btn btn-outline" href="/shipping">
                  Cambiar
                </Link>
              </div>
            </div>
          </div>
          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title text-2xl">Método de pago</h2>
              <p>
                {paymentMethod === 'PayPal' ? (
                  <Image
                    src={`https://res.cloudinary.com/dqh1coa3c/image/upload/f_auto,q_auto/logo-paypal_leuro4`}
                    alt={paymentMethod}
                    width={150}
                    height={100}
                  />
                ) : paymentMethod === 'MercadoPago' ? (
                  <Image
                    src={`https://res.cloudinary.com/dqh1coa3c/image/upload/f_auto,q_auto/logo-mercado-pago_ta9vwr`}
                    alt={paymentMethod}
                    width={150}
                    height={100}
                  />
                ) : (
                  paymentMethod
                )}
              </p>
              <div>
                <Link className="btn btn-outline" href="/payment">
                  Elegir otro medio de pago
                </Link>
              </div>
            </div>
          </div>
          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <ProductsList items={items} />
              <span className="text-right">
                <FontAwesomeIcon icon={faTruck} /> Envío gratis superando{' '}
                {formatCurrency(freeShippingCost)}
              </span>
              <div>
                <Link className="btn btn-outline" href="/cart">
                  Modificar productos
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">Resumen del pedido</h2>
              <ul className="space-y-3">
                <li>
                  <div className=" flex justify-between">
                    <div>Productos</div>
                    <div>{formatCurrency(itemsPrice)}</div>
                  </div>
                </li>
                <li>
                  <div className=" flex justify-between">
                    <div>Impuestos</div>
                    <div>{formatCurrency(taxPrice)}</div>
                  </div>
                </li>
                <li>
                  <div className=" flex justify-between">
                    <div>Envío</div>
                    <div>{formatCurrency(shippingPrice)}</div>
                  </div>
                </li>
                <li>
                  <div className=" flex justify-between">
                    <div>Total</div>
                    <div>{formatCurrency(totalPrice)}</div>
                  </div>
                </li>

                <li>
                  <button
                    onClick={() => placeOrder()}
                    disabled={isPlacing}
                    className="btn btn-primary w-full"
                  >
                    {isPlacing && <span className="loading loading-spinner"></span>}
                    Confirmar pedido
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Form
