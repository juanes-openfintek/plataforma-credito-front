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
        try {
          console.log('🔐 Attempting login to:', process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/login')
          console.log('📧 Email:', credentials?.email)
          console.log('🔑 Security Token:', process.env.NEXT_PUBLIC_SECURITY_TOKEN?.substring(0, 10) + '...')
          
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
            .then(async (loginRes: any) => {
              console.log('✅ Login response received:', loginRes.data)
              
              if (loginRes.data.token) {
                const loginToken = loginRes.data.token;
                
                // Check if user data is already in login response
                if (loginRes.data.user || loginRes.data._id) {
                  console.log('✅ User data found in login response, skipping validation');
                  const user = loginRes.data.user || loginRes.data;
                  const userData = {
                    id: user._id || user.uid, // Usar uid si no hay _id
                    uid: user.uid,
                    name: user.name || '',
                    secondName: user.secondName || '',
                    email: user.email,
                    lastname: user.lastname || '',
                    secondLastname: user.secondLastname || '',
                    token: loginToken,
                    roles: user.roles || ['user'],
                    phoneNumber: user.phoneNumber || '',
                    birthdate: user.dateOfBirth || user.birthdate || '',
                    documentNumber: user.documentNumber || '',
                    documentType: user.documentType || '',
                    commission: user.commission || 0,
                    identificationNumber: user.identificationNumber || '',
                  }
                  console.log('📦 User data to encrypt:', userData)
                  console.log('🔑 Encryption key available:', !!process.env.NEXT_PUBLIC_ENCRYPT_KEY)
                  
                  try {
                    const encryptedData = encryptData(userData)
                    console.log('✅ Data encrypted successfully')
                    return encryptedData;
                  } catch (encryptError) {
                    console.error('❌ Encryption failed:', encryptError)
                    return null
                  }
                }
                
                // If no user data in login response, try validation endpoint
                console.log('🔍 User data not in login response, trying validation endpoint');
                return await axios
                  .get(process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/validate', {
                    headers: {
                      'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
                      Authorization: `Bearer ${loginToken}`,
                    },
                  })
                  .then((validateRes: any) => {
                    console.log('✅ Validation response received:', validateRes.data)
                    const userData = {
                      id: validateRes.data._id,
                      uid: validateRes.data.uid,
                      name: validateRes.data.name,
                      secondName: validateRes.data.secondName,
                      email: validateRes.data.email,
                      lastname: validateRes.data.lastname,
                      secondLastname: validateRes.data.secondLastname,
                      token: loginToken,
                      roles: validateRes.data.roles,
                      phoneNumber: validateRes.data.phoneNumber,
                      birthdate: validateRes.data.dateOfBirth,
                      documentNumber: validateRes.data.documentNumber,
                      documentType: validateRes.data.documentType,
                      commission: validateRes.data.commission,
                      identificationNumber: validateRes.data.identificationNumber,
                    }
                    
                    try {
                      const encryptedData = encryptData(userData)
                      console.log('✅ Validation data encrypted successfully')
                      return encryptedData
                    } catch (encryptError) {
                      console.error('❌ Validation encryption failed:', encryptError)
                      return null
                    }
                  })
                  .catch((err) => {
                    console.error('❌ Validation error:', err.response?.data || err.message)
                    console.error('⚠️  Falling back to login data only')
                    // Fallback: return minimal user data with just the token
                    return null
                  })
              } else {
                console.error('❌ No token received from login')
                return null
              }
            })
            .catch((err) => {
              console.error('❌ Login error:', {
                status: err.response?.status,
                statusText: err.response?.statusText,
                data: err.response?.data,
                message: err.message,
                url: err.config?.url,
                headers: err.config?.headers
              })
              return null
            })
          return user
        } catch (error: any) {
          console.error('❌ Unexpected error in authorize:', error)
          return null
        }
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
