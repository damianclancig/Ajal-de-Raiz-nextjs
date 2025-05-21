import { Metadata } from 'next'
import Form from './Form'

export const metadata: Metadata = {
  title: 'Recuperar contraseña',
}

export default async function RecoverPassword() {
  return <Form />
}
