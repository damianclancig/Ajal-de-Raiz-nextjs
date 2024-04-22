import data from '@/lib/data'
import dbConnet from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'
import UserModel from '@/lib/models/UserModel'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {

  return NextResponse.json({
    message: 'Seed Successfully',
  })
}
