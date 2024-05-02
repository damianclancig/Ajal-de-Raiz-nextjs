import AddToCart from '@/components/products/AddToCart'
import { convertDocToObj, formatCurrency, optimizeImage } from '@/lib/utils'
import productServices from '@/lib/services/productServices'
import Image from 'next/image'
import { BackButton } from '@/components/BackButton'
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

  const linkBack = () => {
    if (searchParams.backTo === 'adminProd')
      return <BackButton link="/admin/products" title="Volver a productos" />
    else if (searchParams.backTo === 'cart')
      return <BackButton link="/cart" title="Volver al carrito" />
    else if (searchParams.backTo === 'order')
      return <BackButton link={`/order/${searchParams.orderId}`} title="Volver al pedido" />
    else if (searchParams.backTo === 'adminOrder')
      return (
        <BackButton
          link={`/order/${searchParams.orderId}?backTo=adminOrders`}
          title="Volver al pedido"
        />
      )
    else return <BackButton link="/" title="Volver a inicio" />
  }

  return (
    <>
      <div className="my-2">{linkBack()} </div>
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
        <div>
          <ul className="space-y-4">
            <li>
              <h1 className="text-xl">{product.name}</h1>
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
                  <AddToCart item={{ ...convertDocToObj(product), qty: 0, color: '', size: '' }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
