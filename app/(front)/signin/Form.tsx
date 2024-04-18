'use client'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

type Inputs = {
  email: string
  password: string
}

const Form = () => {
  const { data: session } = useSession()

  const params = useSearchParams()
  let callbackUrl = params.get('callbackUrl') || '/'
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (session && session.user) {
      router.push(callbackUrl)
    }
  }, [callbackUrl, params, router, session])

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { email, password } = form
    signIn('credentials', {
      email,
      password,
    })
  }

  return (
    <div className="max-w-sm mx-auto card bg-base-300 my-4">
      <div className="card-body">
        <h1 className="card-title">Inicio de sesión</h1>
        {params.get('error') && (
          <div className="alert text-error">
            {params.get('error') === 'CredentialsSignin'
              ? 'E-mail y/o contraseña no son correctas'
              : params.get('error')}
          </div>
        )}
        {params.get('success') && <div className="alert text-success">{params.get('success')}</div>}
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="my-2">
            <label htmlFor="email" className="label">
              E-mail
            </label>
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
            <label htmlFor="password" className="label">
              Contraseña
            </label>
            <input
              type="text"
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
          <div className="my-4">
            <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
              {isSubmitting && <span className="loading loading-spinner"></span>}Iniciar sesión
            </button>
          </div>
        </form>
        <div className="divider"></div>

        <div>
          ¿Necesita una cuenta?{' '}
          <Link className="link" href={`/register?callbackUrl=${callbackUrl}`}>
            Registarse
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Form
