import { Metadata } from 'next'
import Form from './Form'

export const metadata: Metadata = {
  title: 'Inicio de sesión',
}

export default async function Signin() {
  return <Form />
}
