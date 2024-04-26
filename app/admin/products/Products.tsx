'use client'
import { Product } from '@/lib/models/ProductModel'
import { formatCurrency, formatId, optimizeImage } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

export default function Products() {
  const { data: products, error } = useSWR(`/api/admin/products`)
  const router = useRouter()

  const { trigger: deleteProduct } = useSWRMutation(
    `/api/admin/products`,
    async (url, { arg }: { arg: { productId: string | undefined } }) => {
      const toastId = toast.loading('Eliminando producto...')
      const res = await fetch(`${url}/${arg.productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      res.ok
        ? toast.success('Producto eliminado.', {
            id: toastId,
          })
        : toast.error(data.message, {
            id: toastId,
          })
    }
  )

  if (error) return 'Ha ocurrido un error'
  if (!products)
    return (
      <div className="flex flex-row min-h-screen justify-center items-center">
        <div className="loading loading-bars loading-lg"></div>
      </div>
    )

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="py-4 text-2xl">Productos</h1>
        <Link href={`/admin/products/new`} type="button" className="btn btn-primary btn-sm">
          Crear
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra bg-base-100">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Cantidad</th>
              <th>Rating</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: Product) => (
              <tr key={product._id}>
                <td>{formatId(product._id)}</td>
                <td>
                  <Link href={`/product/${product.slug}?backTo=adminProd`}>
                    <Image
                      src={optimizeImage(product.image, 50)}
                      alt={product.name}
                      width={50}
                      height={50}
                    />
                  </Link>
                </td>
                <td>{product.name}</td>
                <td>{formatCurrency(product.price)}</td>
                <td>{product.category}</td>
                <td>{product.countInStock}</td>
                <td>{product.rating}</td>
                <td>
                  <Link
                    href={`/admin/products/${product._id}`}
                    type="button"
                    className="btn btn-outline btn-sm mb-1"
                  >
                    Editar
                  </Link>
                  &nbsp;
                  <button
                    onClick={() => deleteProduct({ productId: product._id })}
                    type="button"
                    className="btn btn-outline btn-error btn-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
