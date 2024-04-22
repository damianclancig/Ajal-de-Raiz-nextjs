'use client'
import CheckoutSteps from '@/components/CheckoutSteps'
import useCartService from '@/lib/hooks/useCartStore'
import { formatCurrency, optimizeImage } from '@/lib/utils'
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
        toast.success('Order placed successfully')
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod, router])

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <></>

  return (
    <div>
      <CheckoutSteps current={4} />
      <div className="grid md:grid-cols-4 md:gap-5 my-4">
        <div className="overflow-x-auto md:col-span-3">
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">Dirección de envío</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                {shippingAddress.country}{' '}
              </p>
              <div>
                <Link className="btn" href="/shipping">
                  Cambiar
                </Link>
              </div>
            </div>
          </div>
          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Método de pago</h2>
              <p>{paymentMethod}</p>
              <div>
                <Link className="btn" href="/payment">
                  Cambiar
                </Link>
              </div>
            </div>
          </div>
          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Productos</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.slug}>
                      <td>
                        <Link href={`/product/${item.slug}`} className="flex items-center">
                          <Image
                            src={optimizeImage(item.image, 50)}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className="px-2">
                            {item.name} ({item.color} {item.size})
                          </span>
                        </Link>
                      </td>
                      <td>
                        <span>{item.qty}</span>
                      </td>
                      <td>{formatCurrency(item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <Link className="btn" href="/cart">
                  Cambiar
                </Link>
              </div>
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
  )
}
export default Form
