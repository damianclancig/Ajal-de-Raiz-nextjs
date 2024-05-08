import ProductItem from '@/components/products/ProductItem'
import productServices from '@/lib/services/productServices'
import Link from 'next/link'
import Filters from '@/components/products/Filters'

const sortOrders = [
  { code: 'newest', name: 'Más nuevos' },
  { code: 'lowest', name: 'Menor precio' },
  { code: 'highest', name: 'Mayor precio' },
  { code: 'toprated', name: 'Mejor puntuación' },
]

export async function generateMetadata({
  searchParams: { q = 'all', category = 'all', price = 'all', rating = 'all' },
}: {
  searchParams: {
    q: string
    category: string
    price: string
    rating: string
    sort: string
    page: string
  }
}) {
  if ((q !== 'all' && q !== '') || category !== 'all' || rating !== 'all' || price !== 'all') {
    return {
      title: `Buscar ${q !== 'all' ? q : ''}
       ${category !== 'all' ? ` : Categoría ${category}` : ''}
       ${price !== 'all' ? ` : Precio ${price}` : ''}
       ${rating !== 'all' ? ` : Calificación ${rating}` : ''}`,
    }
  } else {
    return {
      title: 'Buscar productos',
    }
  }
}

export default async function SearchPage({
  searchParams: {
    q = '',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  },
}: {
  searchParams: {
    q: string
    category: string
    price: string
    rating: string
    sort: string
    page: string
  }
}) {
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string
    s?: string
    p?: string
    r?: string
    pg?: string
  }) => {
    const params = { q, category, price, rating, sort, page }
    if (c) params.category = c
    if (p) params.price = p
    if (r) params.rating = r
    if (pg) params.page = pg
    if (s) params.sort = s
    return `/search?${new URLSearchParams(params).toString()}`
  }

  const { countProducts, products, pages } = await productServices.getByQuery({
    category,
    q,
    price,
    rating,
    page,
    sort,
  })

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="card bg-base-300 bg-opacity-20 backdrop-blur shadow-xl my-4 pl-2">
        <div className={`md:hidden `}>
          <div className="m-2 space-y-2">
            <div className="group flex flex-col gap-2 rounded-lg p-5" tabIndex={1}>
              <div className="flex cursor-pointer items-center justify-between">
                <span className="text-xl font-bold">Filtros</span>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/9/96/Chevron-icon-drop-down-menu-WHITE.png"
                  className="h-2 w-3 transition-all duration-500 group-focus:-rotate-180"
                />
              </div>
              <div className="invisible h-auto max-h-0 items-center opacity-0 transition-all group-focus:visible group-focus:max-h-screen group-focus:opacity-100 group-focus:duration-1000">
                <Filters
                  getFilterUrl={getFilterUrl}
                  category={category}
                  price={price}
                  rating={rating}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={`hidden md:block`}>
          <Filters getFilterUrl={getFilterUrl} category={category} price={price} rating={rating} />
        </div>
      </div>

      <div className="md:col-span-4">
        <div className="flex items-center justify-between flex-col py-2 card bg-base-300 bg-opacity-20 backdrop-blur shadow-xl my-4">
          <div className="flex flex-wrap justify-center">
            Ordenar por:{' '}
            {sortOrders.map((s) => (
              <Link
                key={s.code}
                className={`mx-2 link link-primary link-hover ${
                  sort == s.code ? 'link-info' : ''
                } text-nowrap`}
                href={getFilterUrl({ s: s.code })}
              >
                {s.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center">
            {products.length === 0 ? 'Sin' : countProducts} resultados
            {q !== 'all' && q !== '' && ' - Búsqueda: ' + q}
            {category !== 'all' && ' : ' + category}
            {price !== 'all' && ' : Precio $' + price}
            {rating !== 'all' && ' : Calificación ' + rating}
            &nbsp;
            {(q !== 'all' && q !== '') ||
            category !== 'all' ||
            rating !== 'all' ||
            price !== 'all' ? (
              <Link className="btn btn-sm btn-ghost" href="/search">
                Limpiar
              </Link>
            ) : null}
          </div>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 ">
            {products.map((product) => (
              <ProductItem key={product.slug} product={product} />
            ))}
          </div>
          <div className="join">
            {products.length > 0 &&
              Array.from(Array(pages).keys()).map((p) => (
                <Link
                  key={p}
                  className={`join-item btn ${Number(page) === p + 1 ? 'btn-active' : ''} `}
                  href={getFilterUrl({ pg: `${p + 1}` })}
                >
                  {p + 1}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
