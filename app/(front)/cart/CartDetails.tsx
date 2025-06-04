'use client'

import useCartService from '@/lib/hooks/useCartStore'
import { formatCurrency, freeShippingCost, optimizeImage } from '@/lib/utils'
import { faTruck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CartDetails() {
  const router = useRouter()
  const { items, itemsPrice, decrease, increase } = useCartService()

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return <></>

  return (
    <>
      {items.length === 0 ? (
        <div className="flex flex-col items-center py-4">
          <span className="text-3xl">El carrito está vacío.</span>
          <Image
            src={
              'https://res.cloudinary.com/dqh1coa3c/image/upload/f_auto,q_auto/jy2jyjqs1hj03is7xhln'
            }
            alt="CartEmpty"
            height={300}
            width={300}
            className="py-5"
          />
          <Link href="/search" className="btn btn-primary">
            Buscar productos
          </Link>
        </div>
      ) : (
        <>
          <h1 className="py-4 text-3xl">Carrito de compras</h1>
          <div className="grid md:grid-cols-4 md:gap-5">
            <div className="overflow-x-auto md:col-span-3">
              <table className="table table-zebra bg-base-100">
                <thead>
                  <tr className="text-lg">
                    <th>Producto</th>
                    <th className="w-48">Cantidad</th>
                    <th className="text-right w-48">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.slug}>
                      <td>
                        <Link
                          href={`/product/${item.slug}?backTo=cart`}
                          className="flex items-center"
                        >
                          <Image
                            src={optimizeImage(item.image, 50)}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className="px-2 text-lg md:text-xl">{item.name}</span>
                        </Link>
                      </td>
                      <td className="flex items-center">
                        <button
                          className="btn btn-primary p-2"
                          type="button"
                          onClick={() => decrease(item)}
                        >
                          {item.qty == 1 ? (
                            // trash button
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 448 512"
                              className="h-5 w-5"
                            >
                              <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                            </svg>
                          ) : (
                            // minus button
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 448 512"
                              className="h-5 w-5"
                            >
                              <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
                            </svg>
                          )}
                        </button>
                        <span className="px-2 md:px-5 text-xl">{item.qty}</span>
                        <button
                          className="btn btn-primary p-2"
                          type="button"
                          onClick={() => increase(item)}
                        >
                          {/* plus button */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            className="h-5 w-5"
                          >
                            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                          </svg>
                        </button>
                      </td>
                      <td className="text-right text-xl md:text-lx">
                        {formatCurrency(item.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="text-lg">
                    <td>Total</td>
                    <td></td>
                    <td className="text-right">{formatCurrency(itemsPrice)}</td>
                  </tr>
                  <tr className="text-lg">
                    <td colSpan={3} className="text-right">
                      <span>
                        <FontAwesomeIcon icon={faTruck} /> Envío gratis superando{' '}
                        {formatCurrency(freeShippingCost)}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="mt-2 md:mt-0">
              <div className="card bg-base-300">
                <div className="card-body">
                  <ul>
                    <li>
                      <div className="pb-3 text-xl">
                        Subtotal ({items.reduce((a, c) => a + c.qty, 0)}):{' '}
                        {formatCurrency(itemsPrice)}
                      </div>
                    </li>
                    <li className='pb-3'>
                      <button
                        className="btn btn-primary w-full flex-nowrap"
                        onClick={() => router.push('/shipping')}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 384 512"
                          className="h-6 w-6"
                        >
                          <path d="M14 2.2C22.5-1.7 32.5-.3 39.6 5.8L80 40.4 120.4 5.8c9-7.7 22.3-7.7 31.2 0L192 40.4 232.4 5.8c9-7.7 22.3-7.7 31.2 0L304 40.4 344.4 5.8c7.1-6.1 17.1-7.5 25.6-3.6s14 12.4 14 21.8V488c0 9.4-5.5 17.9-14 21.8s-18.5 2.5-25.6-3.6L304 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L192 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L80 471.6 39.6 506.2c-7.1 6.1-17.1 7.5-25.6 3.6S0 497.4 0 488V24C0 14.6 5.5 6.1 14 2.2zM96 144c-8.8 0-16 7.2-16 16s7.2 16 16 16H288c8.8 0 16-7.2 16-16s-7.2-16-16-16H96zM80 352c0 8.8 7.2 16 16 16H288c8.8 0 16-7.2 16-16s-7.2-16-16-16H96c-8.8 0-16 7.2-16 16zM96 240c-8.8 0-16 7.2-16 16s7.2 16 16 16H288c8.8 0 16-7.2 16-16s-7.2-16-16-16H96z" />
                        </svg>
                        Proceder al pago.
                      </button>
                    </li>
                    <li>
                      <button
                        className="btn btn-primary w-full flex-nowrap"
                        onClick={() => router.push('/search')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="h-6 w-6">
                        <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>
                        Seguir comprando.
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
