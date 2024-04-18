import { Metadata } from 'next'
import Form from './Form'

export const metadata: Metadata = {
  title: 'Métodos de pago',
}
const page = () => {
  return <Form />
}
export default page
