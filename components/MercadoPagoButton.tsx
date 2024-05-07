import { useEffect, useState } from 'react'
import useSWR from 'swr'

export default function MercadoPagoButton({
  orderId,
  amount,
  message,
}: {
  orderId: string
  amount: number
  message: string
}) {
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
        console.log('data', data)
        setUrl(data)

        setLoading(false)
      })
  }

  useEffect(() => {
    try {
      generateLink()
    } catch (error) {
      console.error(error)
    }
  }, [orderId])

  return (
    <>
      {loading ? (
        <button className="btn btn-primary">Loading</button>
      ) : (
        <a href={url!} className="btn btn-primary">
          Continuar con MercadoPago
        </a>
      )}
    </>
  )
}
