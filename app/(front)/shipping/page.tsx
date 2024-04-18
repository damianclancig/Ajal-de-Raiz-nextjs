import { Metadata } from 'next'
import Form from './Form'

export const metadata: Metadata = {
  title: 'Dirección de envío',
}

export default function Shipping() {
  return <Form />
}
