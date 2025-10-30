import axios from 'axios'
import { NextResponse, NextRequest } from 'next/server'
import decryptData from '../../../helpers/decryptData'

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const decryptedData = await decryptData(body.token)
  let name, middleName, lastname, secondLastname
  const splitName = decryptedData?.values?.completeName?.split(' ')
  switch (splitName.length) {
    case 1:
      name = splitName[0]
      break
    case 2:
      name = splitName[0]
      lastname = splitName[1]
      break
    case 3:
      name = splitName[0]
      lastname = splitName[1]
      secondLastname = splitName[2]
      break
    case 4:
      name = splitName[0]
      middleName = splitName[1]
      lastname = splitName[2]
      secondLastname = splitName[3]
      break
    default:
      name = splitName[0]
      lastname = splitName[1]
      break
  }
  const bodyToUpdate: any = {
    id: decryptedData?.values.id,
    email: decryptedData?.values.email,
    name: `${name}${middleName ? ' ' + middleName : ''}`,
    lastname: `${lastname}${secondLastname ? ' ' + secondLastname : ''}`,
    roles: [decryptedData?.values.role],
    identificationNumber: decryptedData?.values.identificationNumber,
    commission: decryptedData?.values.commission.toString(),
  }
  if (decryptedData?.values.asignPassword !== '*****') {
    bodyToUpdate.uid = decryptedData?.values.uid
    bodyToUpdate.password = decryptedData?.values.asignPassword
  }
  return await axios
    .put(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/update-user-admin',
      bodyToUpdate,
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
          Authorization: `Bearer ${decryptedData?.token}`,
        },
      }
    )
    .then((res: any) => {
      return NextResponse.json(
        { message: 'Successful updated user' },
        {
          status: res.status,
        }
      )
    })
    .catch((err: any) => {
      return NextResponse.json(err.response.data, {
        status: err.response.status,
      })
    })
}
