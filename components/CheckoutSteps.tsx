const CheckoutSteps = ({ current = 0 }) => {
  return (
    <ul className="steps steps-vertical md:steps-horizontal w-full mt-4 bg-base-300 bg-opacity-20 backdrop-blur shadow-xl rounded-xl py-3 pl-16 md:pl-0">
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
