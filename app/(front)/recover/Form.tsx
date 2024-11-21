'use client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

type Inputs = {
  email: string
}

const Form = () => {
  const { data: session } = useSession()

  const params = useSearchParams()
  const router = useRouter()

  let callbackUrl = params.get('callbackUrl') || '/'
  const allowedUrls = ['/', '/register', '/signin', '/cart']
  if (!allowedUrls.includes(callbackUrl)) {
    callbackUrl = '/'
  }
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      email: '',
    },
  })

  useEffect(() => {
    if (session && session.user) {
      router.push(callbackUrl)
    }
  }, [callbackUrl, params, router, session])

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { email } = form
    try {
      const res = await fetch('/api/auth/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        return router.push(`/signin?callbackUrl=${callbackUrl}&success=${data.message}`)
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (err: any) {
      const msg =
        err.message && err.message.indexOf('E11000') === 0 ? 'El e-mail ya existe.' : err.message
      // toast.error(msg || 'Error')
      toast.error(msg)
      // toast.custom(() => (
      //   <div className="toast toast-top toast-center">
      //     <div className="alert alert-error ">
      //       <p className="text-white text-xl w-full max-w-lg px-4 break-words">{msg}</p>
      //     </div>
      //   </div>
      // ))
    }
  }

  const [showPass, setShowPass] = useState(false)
  const [showPassConfirm, setShowPassConfirm] = useState(false)

  return (
    <div className="max-w-sm mx-auto card my-4 backdrop-blur border-2 border-base-100">
      <div className="card-body">
        <h1 className="card-title">Recuperar contraseña</h1>
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
                required: 'Por favor, ingresa tu correo electrónico.',
                pattern: {
                  value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                  message: 'Por favor, ingresa un correo válido.',
                },
              })}
              className="input input-bordered w-full max-w-sm"
            />
            {errors.email?.message && <div className="text-error">{errors.email.message}</div>}
          </div>
          <div className="my-4">
            <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
              {isSubmitting && <span className="loading loading-spinner"></span>} Recuperar
            </button>
          </div>
        </form>
        <div className="divider"></div>
        <div>
          ¿Aún no tienes una cuenta?{' '}
          <Link className="link" href={`/register?callbackUrl=${callbackUrl}`}>
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Form
