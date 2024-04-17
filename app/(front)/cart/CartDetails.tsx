'use client'

import useCartServices from '@/lib/hooks/useCartStore'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CartDetails() {
  const router = useRouter()
  const { items, itemsPrice, decrease, increase } = useCartServices()

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return <></>

  return (
    <>
      <h1 className="py-4 text-2xl">Carrito de compras</h1>
      {items.length === 0 ? (
        <div>
          El carrito está vacío. <Link href="/">Ver productos</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
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
                        <Image src={item.image} alt={item.name} width={50} height={50} />
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </td>
                    <td>
                      <button className="btn" type="button" onClick={() => decrease(item)}>
                        -
                      </button>
                      <span className="px-2">{item.qty}</span>
                      <button className="btn" type="button" onClick={() => increase(item)}>
                        +
                      </button>
                    </td>
                    <td>$ {item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div className="card bg-base-300">
              <div className="card-body">
                <ul>
                  <li>
                    <div className="pb-3 text-xl">
                      Subtotal ({items.reduce((a, c) => a + c.qty, 0)}) : $ {itemsPrice}
                    </div>
                  </li>
                  <li>
                    <button
                      className="btn btn-primary w-full"
                      onClick={() => router.push('/shipping')}
                    >
                      Proceder al pago.
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
