'use client'
import CheckoutSteps from '@/components/CheckoutSteps'
import useCartService from '@/lib/hooks/useCartStore'
import { ShippingAddress } from '@/lib/models/OrderModel'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { SubmitHandler, ValidationRule, useForm } from 'react-hook-form'

const Form = () => {
  const router = useRouter()
  const { saveShippingAddress, shippingAddress } = useCartService()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ShippingAddress>({
    defaultValues: {
      fullName: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
    },
  })

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName)
    setValue('address', shippingAddress.address)
    setValue('city', shippingAddress.city)
    setValue('postalCode', shippingAddress.postalCode)
    setValue('country', shippingAddress.country)
  }, [setValue, shippingAddress])

  const formSubmit: SubmitHandler<ShippingAddress> = async (form) => {
    saveShippingAddress(form)
    router.push('/payment')
  }
  const FormInput = ({
    id,
    name,
    required,
    pattern,
  }: {
    id: keyof ShippingAddress
    name: string
    required?: boolean
    pattern?: ValidationRule<RegExp>
  }) => (
    <div className="mb-2">
      <label className="label" htmlFor={id}>
        {name}
      </label>
      <input
        type="text"
        id={id}
        {...register(id, {
          required: required && `${name} es requerido.`,
          pattern,
        })}
        className="input input-bordered w-full max-w-sm"
      />
      {errors[id]?.message && <div className="text-error">{errors[id]?.message}</div>}
    </div>
  )

  return (
    <div>
      <CheckoutSteps current={1} />
      <div className="max-w-sm mx-auto card bg-base-300 my-4">
        <div className="card-body">
          <h1 className="card-title">Dirección de envío</h1>
          <form onSubmit={handleSubmit(formSubmit)}>
            <FormInput name="Nombre completo" id="fullName" required />
            <FormInput name="Dirección" id="address" required />
            <FormInput name="Ciudad" id="city" required />
            <FormInput name="Códito postal" id="postalCode" required />
            <FormInput name="País" id="country" required />
            <div className="mt-6 -mb-3">
              <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
                {isSubmitting && <span className="loading loading-spinner"></span>}
                Siguiente
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default Form
