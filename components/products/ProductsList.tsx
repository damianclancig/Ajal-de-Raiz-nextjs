import { OrderItem } from '@/lib/models/OrderModel'
import { formatCurrency, optimizeImage } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export const ProductsList = ({ items }: any) => {
  return (
    <>
      <h2 className="card-title text-2xl">Productos</h2>
      <table className="table table-zebra bg-base-100">
        <thead>
          <tr className="text-xl">
            <th>Producto</th>
            <th className="w-20">Cant.</th>
            <th className="text-right w-28">Precio</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: OrderItem) => (
            <tr key={item.slug} className="text-base md:text-xl">
              <td>
                <Link
                  href={`/product/${item.slug}?backTo=placeOrder`}
                  className="flex items-center"
                >
                  <Image
                    src={optimizeImage(item.image, 50)}
                    alt={item.name}
                    width={50}
                    height={50}
                  />
                  <span className="px-2">{item.name}</span>
                  {(item.color || item.size) && (
                    <span>
                      ( {item.color} {item.size} )
                    </span>
                  )}
                </Link>
              </td>
              <td className="text-center md:text-left">
                <span>{item.qty}</span>
              </td>
              <td className="text-right">{formatCurrency(item.price)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="text-xl">
            <td>Total</td>
            <td className="text-center md:text-left">
              {items.reduce((acc: number, item: OrderItem) => acc + item.qty, 0)}
            </td>
            <td className="text-right">
              {formatCurrency(
                items.reduce((acc: number, item: OrderItem) => acc + item.price * item.qty, 0)
              )}
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  )
}
