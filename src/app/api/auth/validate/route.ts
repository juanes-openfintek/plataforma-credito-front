import axios from 'axios'
import { NextResponse, NextRequest } from 'next/server'
import encryptData from '../../../helpers/encryptData'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const token = body.token
  return await axios.get(
    process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/validate',
    {
      headers: {
        'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then(async (res: any) => {
      if (res.data.token) {
        const encrypted = encryptData(res.data)
        return NextResponse.json(encrypted, {
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
