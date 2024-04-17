import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    slug: { type: String, require: true, unique: true },
    category: { type: String, require: true },
    image: { type: String, require: true },
    price: { type: Number, require: true },
    brand: { type: String, require: true },
    rating: { type: Number, require: true, default: 0 },
    numReviews: { type: Number, require: true, default: 0 },
    countInStock: { type: Number, require: true, default: 0 },
    description: { type: String, require: true },
    isFeatured: { type: Boolean, require: true },
    banner: String,
  },
  {
    timestamps: true,
  }
)

const ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema)

export default ProductModel

export type Product = {
  _id?: string
  name: string
  slug: string
  image: string
  banner?: string
  price: number
  brand: string
  description: string
  category: string
  rating: number
  numReviews: number
  countInStock: number
  color?: []
  sizes?: []
}
