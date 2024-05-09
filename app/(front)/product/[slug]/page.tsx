import AddToCart from '@/components/products/AddToCart'
import { convertDocToObj, formatCurrency, optimizeImage } from '@/lib/utils'
import productServices from '@/lib/services/productServices'
import Image from 'next/image'
import { Rating } from '@/components/products/Rating'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await productServices.getBySlug(params.slug)
  if (!product) {
    return { title: 'Producto no encontrado' }
  }
  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductDetails({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { backTo: string; orderId: number }
}) {
  const product = await productServices.getBySlug(params.slug)
  if (!product) return <div>Producto no encontrado</div>

  return (
    <>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={optimizeImage(product.image, 640)}
            alt={product.name}
            width={640}
            height={640}
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
            className="rounded-xl"
          />
        </div>
        <div className="grid md:grid-cols-2 md:col-span-2 card bg-base-300 bg-opacity-20 backdrop-blur shadow-xl p-2 mt-2 md:mt-0">
          <div>
            <ul className="space-y-4">
              <li>
                <h1 className="text-3xl">{product.name}</h1>
              </li>
              <li className="text-sm">
                <Rating value={product.rating} />
                {product.rating} de {product.numReviews} valoraciones
              </li>
              <li className="font-bold">{product.brand}</li>
              <li>
                <div className="divider"></div>
              </li>
              <li>
                <u>Descripción:</u>
                <p>{product.description}</p>
              </li>
            </ul>
          </div>
          <div>
            <div className="card bg-base-300 shadow-xl mt-3 md:mt-0">
              <div className="card-body">
                <div className="mb-2 flex justify-between">
                  <div>Precio</div>
                  <div>{formatCurrency(product.price)}</div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Estado</div>
                  <div>{product.countInStock > 0 ? 'Disponible' : 'No Disponible'}</div>
                </div>
                {product.countInStock !== 0 && (
                  <div className="card-actions justify-center">
                    <AddToCart
                      item={{ ...convertDocToObj(product), qty: 0, color: '', size: '' }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
