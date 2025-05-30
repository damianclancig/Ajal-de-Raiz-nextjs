import Credentials from 'next-auth/providers/credentials'
import UserModel from './models/UserModel'
import dbConnect from './dbConnect'
import bcrypt from 'bcryptjs'
import NextAuth from 'next-auth'

export const config = {
  providers: [
    Credentials({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      authorize: async (credentials) => {
        await dbConnect()
        if (!credentials || !credentials.email || typeof credentials.password !== 'string') {
          return null
        }
        const user = await UserModel.findOne({ email: credentials.email })
        if (!user) {
          return null
        }
        const isMatch = await user.comparePassword(credentials.password)
        if (!isMatch) {
          return null
        }
        return {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin || false, // Si tienes roles
        }
      },
    }),
  ],
  pages: {
    signIn: '/signin',
    newUser: '/register',
    error: '/signin',
  },
  callbacks: {
    authorized({ request, auth }: any) {
      const protectedPaths = [
        /\/shipping/,
        /\/payment/,
        /\/place-order/,
        /\/profile/,
        /\/order\/(.*)/,
        /\/admin/,
      ]
      const { pathname } = request.nextUrl
      if (protectedPaths.some((p) => p.test(pathname))) return !!auth
      return true
    },
    jwt: async ({ user, trigger, session, token }: any) => {
      if (user) {
        token.user = {
          _id: user._id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
        }
      }
      if (trigger === 'update' && session) {
        token.user = {
          ...token.user,
          email: session.user.email,
          name: session.user.name,
        }
      }
      return token
    },
    session: async ({ session, token }: any) => {
      if (token) {
        session.user = token.user
      }
      return session
    },
  },
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config)
