import { Product } from '@/lib/models/ProductModel'
import { formatCurrency, optimizeImage } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export default function ProductItem({ product }: { product: Product }) {
  return (
    <div className="card bg-base-300 bg-opacity-20 backdrop-blur shadow-xl mb-4 border-4 border-base-300 ">
      <figure>
        <Link href={`/product/${product.slug}`}>
          <Image
            src={optimizeImage(product.image, 300)}
            alt={product.name}
            width={300}
            height={300}
            className="object-cover h-52 w-54"
          />
        </Link>
      </figure>
      <div className="card-body ">
        <Link href={`/product/${product.slug}`}>
          <h2 className="card-title font-normal">{product.name}</h2>
        </Link>
        <p className="mb-2">{product.brand}</p>
        <div className="card-actions flex items-center justify-between">
          <span className="text-2xl">{formatCurrency(product.price)}</span>
        </div>
      </div>
    </div>
  )
}
