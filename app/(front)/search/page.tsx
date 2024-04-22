import { Rating } from '@/components/components/product/Rating'
import ProductItem from '@/components/products/ProductItem'
import productServices from '@/lib/services/productServices'
import Link from 'next/link'
import React from 'react'

const sortOrders = [
  { code: 'newest', name: 'Más nuevos' },
  { code: 'lowest', name: 'Menor precio' },
  { code: 'highest', name: 'Mayor precio' },
  { code: 'toprated', name: 'Mejor puntuación' },
]

const prices = [
  {
    name: '$1 hasta $500',
    value: '1-500',
  },
  {
    name: '$501 hasta $1.000',
    value: '501-1000',
  },
  {
    name: '$1.001 hasta $5.000',
    value: '1001-5000',
  },
  {
    name: '$5.001 hasta $10.000',
    value: '5001-10000',
  },
  {
    name: '$10.001 hasta $50.000',
    value: '10001-50000',
  },
  {
    name: '$50.001 en adelante',
    value: '50001-99999999',
  },
]

const ratings = [5, 4, 3, 2, 1]

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
      title: `Search ${q !== 'all' ? q : ''}
       ${category !== 'all' ? ` : Category ${category}` : ''}
       ${price !== 'all' ? ` : Price ${price}` : ''}
       ${rating !== 'all' ? ` : Rating ${rating}` : ''}`,
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
  const categories = await productServices.getCategories()
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
      <div>
        <div className="text-xl pt-3 underline">Categorías</div>
        <div>
          <ul>
            <li>
              <Link
                className={`link link-hover ${'all' === category && 'link-info'}`}
                href={getFilterUrl({ c: 'all' })}
              >
                Todos
              </Link>
            </li>
            {categories.map((c: string) => (
              <li key={c}>
                <Link
                  className={`link link-hover ${c === category && 'link-info'}`}
                  href={getFilterUrl({ c })}
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xl pt-3 underline">Precio</div>
          <ul>
            <li>
              <Link
                className={`link link-hover ${'all' === price && 'link-info'}`}
                href={getFilterUrl({ p: 'all' })}
              >
                Todos
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link
                  href={getFilterUrl({ p: p.value })}
                  className={`link link-hover ${p.value === price && 'link-info'}`}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xl pt-3 underline">Calificación</div>
          <ul>
            <li>
              <Link
                href={getFilterUrl({ r: 'all' })}
                className={`link link-hover ${'all' === rating && 'link-info'}`}
              >
                Todos
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link
                  href={getFilterUrl({ r: `${r}` })}
                  className={`link link-hover ${`${r}` === rating && 'link-info'}`}
                >
                  <Rating caption={''} value={r}></Rating>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:col-span-4">
        <div className="flex items-center justify-between flex-col-reverse py-4">
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
          <div className="flex flex-wrap">
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
        </div>

        <div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3  ">
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
