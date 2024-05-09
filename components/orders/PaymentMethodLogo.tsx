import Image from 'next/image'

export const PaymentMethodLogo = ({ paymentMethod }: { paymentMethod: string }) => {
  return (
    <>
      <p>
        {paymentMethod === 'PayPal' ? (
          <Image
            src={`https://res.cloudinary.com/dqh1coa3c/image/upload/f_auto,q_auto/logo-paypal_leuro4`}
            alt={paymentMethod}
            width={150}
            height={100}
          />
        ) : paymentMethod === 'MercadoPago' ? (
          <Image
            src={`https://res.cloudinary.com/dqh1coa3c/image/upload/f_auto,q_auto/logo-mercado-pago_ta9vwr`}
            alt={paymentMethod}
            width={150}
            height={100}
          />
        ) : (
          paymentMethod
        )}
      </p>
    </>
  )
}
