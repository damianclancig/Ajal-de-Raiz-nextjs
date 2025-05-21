'use client'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

type Inputs = {
  password: string
  confirmPassword: string
}

const ResetPasswordForm = () => {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get('token')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<Inputs>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const formSubmit: SubmitHandler<Inputs> = async ({ password, confirmPassword }) => {
    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      })

      if (res.ok) {
        toast.success('¡Contraseña restablecida con éxito! Redirigiendo...')
        setTimeout(() => router.push('/signin'), 3000)
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al restablecer la contraseña.')
    }
  }

  const [showPass, setShowPass] = useState(false)
  const [showPassConfirm, setShowPassConfirm] = useState(false)

  return (
    <div className="max-w-sm mx-auto card my-4 backdrop-blur border-2 border-base-100">
      <div className="card-body">
        <h1 className="card-title">Restablecer Contraseña</h1>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="my-2">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-6 w-6">
                <path
                  fill="#FFD43B"
                  d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z"
                />
              </svg>
              <label htmlFor="password" className="label">
                Nueva Contraseña
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
            <div className="flex">
              <input
                type={showPassConfirm ? 'text' : 'password'}
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
              <div
                className="absolute right-10 mt-3 text-2xl"
                onClick={() => {
                  setShowPassConfirm(!showPassConfirm)
                }}
              >
                <FontAwesomeIcon icon={faEye} className={!showPassConfirm ? 'hidden' : 'block'} />
                <FontAwesomeIcon
                  icon={faEyeSlash}
                  className={showPassConfirm ? 'hidden' : 'block'}
                />
              </div>
            </div>
            {errors.confirmPassword?.message && (
              <div className="text-error">{errors.confirmPassword.message}</div>
            )}
          </div>
          <div className="my-4">
            <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
              {isSubmitting && <span className="loading loading-spinner"></span>} Restablecer
            </button>
          </div>
        </form>
        {/* <div className="divider"></div>
        <div>
          ¿No solicitaste esto?{' '}
          <Link className="link" href="/help">
            Contáctanos
          </Link>
        </div> */}
      </div>
    </div>
  )
}

export default ResetPasswordForm
