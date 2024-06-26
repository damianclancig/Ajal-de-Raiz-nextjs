'use client'
import Link from 'next/link'
import React from 'react'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import useSWR from 'swr'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js'
import { formatNumber } from '@/lib/utils'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement
)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
}

const Dashboard = () => {
  const { data: summary, error } = useSWR(`/api/orders/summary`)

  if (error) return error.message
  if (!summary)
    return (
      <div className="flex flex-row min-h-screen justify-center items-center">
        <div className="loading loading-bars loading-lg"></div>
      </div>
    )

  const salesData = {
    labels: summary.salesData.map((x: { _id: string }) => x._id),
    datasets: [
      {
        fill: true,
        label: 'Ventas',
        data: summary.salesData.map((x: { totalSales: number }) => x.totalSales),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }
  const ordersData = {
    labels: summary.salesData.map((x: { _id: string }) => x._id),
    datasets: [
      {
        fill: true,
        label: 'Pedidos',
        data: summary.salesData.map((x: { totalOrders: number }) => x.totalOrders),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }
  const productsData = {
    labels: summary.productsData.map((x: { _id: string }) => x._id), // 2022/01 2022/03
    datasets: [
      {
        label: 'Categoría',
        data: summary.productsData.map((x: { totalProducts: number }) => x.totalProducts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
      },
    ],
  }
  const usersData = {
    labels: summary.usersData.map((x: { _id: string }) => x._id), // 2022/01 2022/03
    datasets: [
      {
        label: 'Usuarios',
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        data: summary.usersData.map((x: { totalUsers: number }) => x.totalUsers),
      },
    ],
  }

  return (
    <div>
      <div className="my-4 stats inline-grid md:flex  shadow stats-vertical   md:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Ventas</div>
          <div className="stat-value text-primary">$ {formatNumber(summary.ordersPrice)}</div>
          <div className="stat-desc">
            <Link href="/admin/orders">Ver ventas</Link>
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Pedidos</div>
          <div className="stat-value text-primary">{summary.ordersCount}</div>
          <div className="stat-desc">
            <Link href="/admin/orders">Ver pedidos</Link>
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Productos</div>
          <div className="stat-value text-primary">{summary.productsCount}</div>
          <div className="stat-desc">
            <Link href="/admin/products">Ver productos</Link>
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Usuarios</div>
          <div className="stat-value text-primary">{summary.usersCount}</div>
          <div className="stat-desc">
            <Link href="/admin/users">Ver usuarios</Link>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl py-2">Reporte de ventas</h2>
          <Line data={salesData} />
        </div>
        <div>
          <h2 className="text-xl py-2">Reporte de pedidos</h2>
          <Line data={ordersData} />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl py-2">Reporte de productos</h2>
          <div className="flex items-center justify-center h-80 w-96 ">
            {' '}
            <Doughnut data={productsData} />
          </div>
        </div>
        <div>
          <h2 className="text-xl py-2">Reporte de usuarios</h2>
          <Bar data={usersData} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
