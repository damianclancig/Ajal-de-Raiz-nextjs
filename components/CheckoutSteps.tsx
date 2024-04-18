const CheckoutSteps = ({ current = 0 }) => {
  return (
    <ul className="steps steps-vertical lg:steps-horizontal w-full mt-4">
      {['Inicio de sesión', 'Dirección de envío', 'Métodos de pago', 'Realizar Orden'].map(
        (step, index) => (
          <li className={`step ${index <= current ? 'step-primary' : ''}`}>{step}</li>
        )
      )}
    </ul>
  )
}
export default CheckoutSteps
