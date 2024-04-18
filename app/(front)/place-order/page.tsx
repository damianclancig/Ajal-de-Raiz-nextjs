import { Metadata } from 'next'
import Form from './Form'

export const metadata: Metadata = {
  title: 'Detalle del pedido',
}

const page = () => {
  return <Form />
}
export default page
