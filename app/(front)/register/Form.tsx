'use client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

type Inputs = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const Form = () => {
  const { data: session } = useSession()

  const params = useSearchParams()
  const router = useRouter()

  let callbackUrl = params.get('callbackUrl') || '/'

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    if (session && session.user) {
      router.push(callbackUrl)
    }
  }, [callbackUrl, params, router, session])

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { name, email, password } = form
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })
      if (res.ok) {
        return router.push(`/signin?callbackUrl=${callbackUrl}&success=La cuenta ha sido creado`)
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (err: any) {
      const msg =
        err.message && err.message.indexOf('E11000') === 0 ? 'El e-mail ya existe.' : err.message
      toast.error(msg || 'Error')
    }
  }

  return (
    <div className="max-w-sm mx-auto card bg-base-300 my-4">
      <div className="card-body">
        <h1 className="card-title">Crear una cuenta</h1>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="my-2">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="h-6 w-6">
                <path
                  fill="#FFD43B"
                  d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 256h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zm256-32H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16z"
                />
              </svg>{' '}
              <label htmlFor="name" className="label">
                Nombre
              </label>
            </div>
            <input
              type="text"
              id="name"
              {...register('name', { required: 'El nombre es obligatorio.' })}
              className="input input-bordered w-full max-w-sm"
            />
            {errors.name?.message && <div className="text-error">{errors.name.message}</div>}
          </div>
          <div className="my-2">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-6 w-6">
                <path
                  fill="#FFD43B"
                  d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                />
              </svg>
              <label htmlFor="email" className="label">
                E-mail
              </label>
            </div>
            <input
              type="text"
              id="email"
              {...register('email', {
                required: 'El E-mail es obligatorio.',
                pattern: {
                  value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                  message: 'El E-mail no es válido.',
                },
              })}
              className="input input-bordered w-full max-w-sm"
            />
            {errors.email?.message && <div className="text-error">{errors.email.message}</div>}
          </div>
          <div className="my-2">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-6 w-6">
                <path
                  fill="#FFD43B"
                  d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z"
                />
              </svg>
              <label htmlFor="password" className="label">
                Contraseña
              </label>
            </div>
            <input
              type="password"
              id="password"
              {...register('password', {
                required: 'La contraseña es obligatorio.',
              })}
              className="input input-bordered w-full max-w-sm"
            />
            {errors.password?.message && (
              <div className="text-error">{errors.password.message}</div>
            )}
          </div>
          <div className="my-2">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-6 w-6">
                <path
                  fill="#FFD43B"
                  d="M342.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 178.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l80 80c12.5 12.5 32.8 12.5 45.3 0l160-160zm96 128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 402.7 54.6 297.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l256-256z"
                />
              </svg>
              <label htmlFor="confirmPassword" className="label">
                Confirmar contraseña
              </label>
            </div>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', {
                required: 'La confirmación de la contraseña es obligatorio.',
                validate: (value) => {
                  const { password } = getValues()
                  return password === value || 'Las contraseñas no coinciden.'
                },
              })}
              className="input input-bordered w-full max-w-sm"
            />
            {errors.confirmPassword?.message && (
              <div className="text-error">{errors.confirmPassword.message}</div>
            )}
          </div>
          <div className="my-2">
            <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
              {isSubmitting && <span className="loading loading-spinner"></span>} Registrarme
            </button>
          </div>
        </form>
        <div className="divider"></div>
        <div>
          ¿Ya tienés una cuenta?{' '}
          <Link className="link" href={`/signin?callbackUrl=${callbackUrl}`}>
            Ingresá.
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Form
