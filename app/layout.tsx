import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/header/Header'
import Providers from '@/components/Providers'
import Sidebar from '@/components/Sidebar'
import DrawerButton from '@/components/DrawerButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: process.env.PUBLIC_APP_NAME || 'Ajal de Raiz',
  description: process.env.PUBLIC_APP_DESC || 'Tienda de plantas y suculentas.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* <!-- HTML Meta Tags --> */}
        <title>Ajal de Raiz</title>
        <meta name="description" content="Tienda de plantas, suculentas y cactus." />

        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://ajal-de-raiz-nextjs.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Ajal de Raiz" />
        <meta property="og:description" content="Tienda de plantas, suculentas y cactus." />
        <meta
          property="og:image"
          content="https://opengraph.b-cdn.net/production/documents/9999957f-2762-4816-8a7a-8eaaf0428347.jpg?token=xh4IoZMJjVu13tHW83QglYQmf_DZ2lkq2bRolA7xNVg&height=500&width=500&expires=33249364177"
        />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="ajal-de-raiz-nextjs.vercel.app" />
        <meta property="twitter:url" content="https://ajal-de-raiz-nextjs.vercel.app/" />
        <meta name="twitter:title" content="Ajal de Raiz" />
        <meta name="twitter:description" content="Tienda de plantas, suculentas y cactus." />
        <meta
          name="twitter:image"
          content="https://opengraph.b-cdn.net/production/documents/9999957f-2762-4816-8a7a-8eaaf0428347.jpg?token=xh4IoZMJjVu13tHW83QglYQmf_DZ2lkq2bRolA7xNVg&height=500&width=500&expires=33249364177"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="drawer">
            <DrawerButton />
            <div className="drawer-content">
              {/* Page content here */}
              <div className=" bg-[url('/images/fondos/fondo(1).jpg')] bg-cover bg-fixed bg-center">
                <div className="min-h-screen flex flex-col bg-base-300 bg-opacity-80">
                  <Header />
                  {children}
                  <footer className="footer footer-center p-4 bg-base-300 text-base-content">
                    <p>Copyright 2024 - All right reserved by Ajal de Raiz.</p>
                  </footer>
                </div>
              </div>
            </div>
            <div className="drawer-side z-[100]">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <Sidebar />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
