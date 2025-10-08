import axios from 'axios'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import encryptData from '../../../helpers/encryptData'
import decryptData from '../../../helpers/decryptData'

const handler = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 2 * 60 * 60, // 2 hours
  },
  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user: any = await axios
          .post(
            process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/login',
            { email: credentials?.email, password: credentials?.password },
            {
              headers: {
                'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
              },
            }
          )
          .then(async (res: any) => {
            if (res.data.token) {
              return await axios
                .get(process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/validate', {
                  headers: {
                    'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
                    Authorization: `Bearer ${res.data.token}`,
                  },
                })
                .then((res: any) => {
                  const userData = {
                    id: res.data._id,
                    uid: res.data.uid,
                    name: res.data.name,
                    secondName: res.data.secondName,
                    email: res.data.email,
                    lastname: res.data.lastname,
                    secondLastname: res.data.secondLastname,
                    token: res.data.token,
                    roles: res.data.roles,
                    phoneNumber: res.data.phoneNumber,
                    birthdate: res.data.dateOfBirth,
                    documentNumber: res.data.documentNumber,
                    documentType: res.data.documentType,
                    commission: res.data.commission,
                    identificationNumber: res.data.identificationNumber,
                  }
                  const encryptedData = encryptData(userData)
                  return encryptedData
                })
                .catch((err) => {
                  console.log(`error login: ${err}`)
                  return null
                })
            } else {
              return null
            }
          })
          .catch((err) => {
            console.log(`error login: ${err}`)
            return null
          })
        return user
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }: any) => {
      user && (token.user = user)
      if (trigger === 'update' && session?.name) {
        const userData = decryptData(token.user)
        userData.name = session.name
        userData.secondName = session.secondName
        userData.lastname = session.lastname
        userData.secondLastname = session.secondLastname
        userData.phoneNumber = session.phoneNumber
        userData.email = session.email
        userData.birthdate = session.dateOfBirth
        userData.documentNumber = session.documentNumber
        userData.documentType = session.documentType
        userData.commission = session.commission
        userData.identificationNumber = session.identificationNumber
        const encryptedData = encryptData(userData)
        token.user = encryptedData
      }
      return token
    },
    session: async ({ session, token }: any) => {
      session.user = token.user
      return session
    },
  },
})
export { handler as GET, handler as POST }
