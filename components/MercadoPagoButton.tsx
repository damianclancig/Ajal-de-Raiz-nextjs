import { useEffect, useState } from 'react'

export default function MercadoPagoButton({ orderId }: { orderId: string }) {
  const [url, setUrl] = useState<null | string>(null)
  const [loading, setLoading] = useState<boolean>(true)

  async function generateLink() {
    setLoading(true)
    return await fetch(`/api/orders/${orderId}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUrl(data)
        setLoading(false)
      })
  }

  useEffect(() => {
    generateLink()
  }, [orderId])

  return (
    <>
      {loading ? (
        <button className="btn btn-primary w-full">Loading</button>
      ) : (
        <a href={url!} className="btn btn-primary w-full">
          Continuar con MercadoPago
        </a>
      )}
    </>
  )
}
