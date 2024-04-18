import mongoose from 'mongoose'

const dbConnet = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!)
  } catch (error) {
    throw new Error('Connection Failed')
  }
}

export default dbConnet
