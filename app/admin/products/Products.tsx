'use client'
import { Product } from '@/lib/models/ProductModel'
import { formatCurrency, formatId, optimizeImage } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useState } from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

export default function Products() {
  const { data: products, error } = useSWR(`/api/admin/products`)
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

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

  const handleDelete = async () => {
    if (!selectedProductId) return
    await deleteProduct({ productId: selectedProductId })
    setShowModal(false)
    setSelectedProductId(null)
  }

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
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Cantidad</th>
              <th>Rating</th>
              <th>Destacado</th>
              <th>Banner</th>
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
                <td>{product.isFeatured ? 'Sí' : 'No'}</td>
                <td>{product.banner || '-'}</td>
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
                    onClick={() => {
                      setSelectedProductId(product._id ?? null)
                      setShowModal(true)
                    }}
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

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-base-200 bg-opacity-70 transition-colors"></div>
          <div className="relative bg-base-100 rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-4">¿Está seguro que desea eliminar este producto?</h2>
            <div className="flex justify-evenly w-full mt-4">
              <button
                className="btn btn-error"
                onClick={handleDelete}
              >
                Sí
              </button>
              <button
                className="btn"
                onClick={() => setShowModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
