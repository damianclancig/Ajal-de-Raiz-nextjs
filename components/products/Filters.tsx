import Link from 'next/link'
import { Rating } from './Rating'
import productServices from '@/lib/services/productServices'
import { useState } from 'react'

export default async function Filters({ getFilterUrl, category, price, rating }: any) {
  const categories = await productServices.getCategories()
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

  const showFilters = () => {}

  return (
    <>
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
                href={getFilterUrl({ r: r })}
                className={`link link-hover ${r === rating && 'link-info'}`}
              >
                <Rating value={r} {...(r == rating ? { selected: 'text-info' } : '')} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
