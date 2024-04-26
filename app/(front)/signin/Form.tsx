'use client'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

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

  const [showMessage, setShowMessage] = useState(true)
  useEffect(() => {
    if (session && session.user) {
      router.push(callbackUrl)
    }
    if (params.get('error') || params.get('success')) {
      setTimeout(() => {
        setShowMessage(false)
      }, 5000)
    }
  }, [callbackUrl, params, router, session])

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { email, password } = form
    signIn('credentials', {
      email,
      password,
    })
  }

  const [showPass, setShowPass] = useState(false)

  return (
    <>
      {params.get('error') && showMessage && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-error">
            <span className="text-white text-xl">
              {params.get('error') === 'CredentialsSignin'
                ? 'E-mail y/o contraseña no son correctas'
                : params.get('error')}
            </span>
          </div>
        </div>
      )}
      {params.get('success') && showMessage && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span className="text-white text-xl">{params.get('success')}</span>
          </div>
        </div>
      )}
      <div className="max-w-sm mx-auto card my-4 backdrop-blur border-2 border-base-100">
        <div className="card-body">
          <h1 className="card-title">Inicio de sesión</h1>

          <form onSubmit={handleSubmit(formSubmit)}>
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
              <div className="flex">
                <input
                  type={showPass ? 'text' : 'password'}
                  id="password"
                  {...register('password', {
                    required: 'La contraseña es obligatorio.',
                  })}
                  className="input input-bordered w-full max-w-sm"
                />
                <div
                  className="absolute right-10 mt-3 text-2xl"
                  onClick={() => {
                    setShowPass(!showPass)
                  }}
                >
                  <FontAwesomeIcon icon={faEye} className={!showPass ? 'hidden' : 'block'} />
                  <FontAwesomeIcon icon={faEyeSlash} className={showPass ? 'hidden' : 'block'} />
                </div>
              </div>
              {errors.password?.message && (
                <div className="text-error">{errors.password.message}</div>
              )}
            </div>
            <div className="my-4">
              <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
                {isSubmitting && <span className="loading loading-spinner"></span>}Ingresar
              </button>
            </div>
          </form>
          <div className="divider"></div>

          <div>
            ¿Necesita una cuenta?{' '}
            <Link className="link" href={`/register?callbackUrl=${callbackUrl}`}>
              Registate
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Form
