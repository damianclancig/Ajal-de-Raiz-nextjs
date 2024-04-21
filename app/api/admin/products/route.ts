import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  await dbConnect()
  const products = await ProductModel.find()
  return Response.json(products)
}) as any

export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  const { name, slug, price, category, image, brand, countInStock, description } = await req.json()
  try {
    await dbConnect()
    let product = await ProductModel.findOne({ slug: slug })
    if (!product) {
      product = new ProductModel({
        name: name,
        slug: slug + Math.random(),
        image: image,
        price: price,
        category: category,
        brand: brand,
        countInStock: countInStock,
        description: description,
        rating: 0,
        numReviews: 0,
      })
      await product.save()
      return Response.json(
        { message: 'Producto creado.', product },
        {
          status: 201,
        }
      )
    }
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    )
  }
}) as any
