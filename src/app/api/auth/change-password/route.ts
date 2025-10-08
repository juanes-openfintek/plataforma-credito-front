import axios from 'axios'
import { NextResponse, NextRequest } from 'next/server'
import decryptData from '../../../helpers/decryptData'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const decryptedData = await decryptData(body.token)
  return await axios
    .post(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/login',
      {
        email: decryptedData?.email,
        password: decryptedData?.password,
      },
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
        },
      }
    )
    .then(async (res: any) => {
      if (res.data.token) {
        return await axios
          .post(
            process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/change-password',
            {
              password: decryptedData?.newPassword,
            },
            {
              headers: {
                'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
                Authorization: `Bearer ${res.data.token}`,
              },
            }
          )
          .then(async (res: any) => {
            return NextResponse.json(
              { message: 'Successful' },
              {
                status: 200,
              }
            )
          })
          .catch((err: any) => {
            return NextResponse.json(err.response.data, {
              status: err.response.status,
            })
          })
      }
    })
    .catch((err: any) => {
      return NextResponse.json(err.response.data, {
        status: err.response.status,
      })
    })
}
