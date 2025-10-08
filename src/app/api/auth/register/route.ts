import axios from 'axios'
import decryptData from '../../../helpers/decryptData'
import { NextResponse, NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const decryptedData = await decryptData(body.token)
  return await axios
    .post(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/register',
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
        return NextResponse.json(res.data, {
          status: 200,
        })
      }
    })
    .catch((err: any) => {
      return NextResponse.json(err.response.data, {
        status: err.response.status,
      })
    })
}
