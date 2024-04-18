const CheckoutSteps = ({ current = 0 }) => {
  return (
    <ul className="steps steps-vertical lg:steps-horizontal w-full mt-4">
      {['Inicio de sesión', 'Dirección de envío', 'Métodos de pago', 'Realizar pedido'].map(
        (step, index) => (
          <li key={index} className={`step ${index <= current ? 'step-primary' : ''}`}>
            {step}
          </li>
        )
      )}
    </ul>
  )
}
export default CheckoutSteps
