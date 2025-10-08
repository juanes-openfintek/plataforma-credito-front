import axios from 'axios'
import decryptData from '../../../helpers/decryptData'
import { NextResponse, NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const decryptedData = await decryptData(body.token)
  return await axios
    .put(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/credit/update-credit',
      {
        id: decryptedData.id,
        status: decryptedData.status,
        commission: decryptedData.commission,
        identificationNumber: decryptedData.identificationNumber,
      },
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
          Authorization: `Bearer ${decryptedData.token}`,
        },
      }
    )
    .then(async (res: any) => {
      const message = `
      <div>
        <img src="https://feelpay-front.vercel.app/_next/image?url=%2Fimages%2Ffeelpay-logo.png&w=640&q=75" alt="logo-feelpay" style="width: 350px; align-self: center"/> 
        <h1 style="color: #01b8e5;">¡Hola ${decryptedData.name}!</h1>
            <p>
            Adivina qué... ¡Tu credito fue <span style="color: green;">APROBADO</span>! Dirigete a Feelpay dando clic
            <a style="color: #01b8e5;" href="https://feelpay-front.vercel.app/registro?email=${decryptedData.emailToSend}">AQUÍ</a> para que puedas
            completar tu registro y de esta manera continues el proceso para desembolsar
            tu credito.
            </p>
      </div>`
      return await axios
        .post(
          process.env.NEXT_PUBLIC_BACKEND_URL + '/email',
          {
            to: decryptedData.emailToSend,
            subject: 'Respuesta a tu solicitud de crédito',
            html: message,
          },
          {
            headers: {
              'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
            },
          }
        )
        .then((res: any) => {
          return NextResponse.json(res.data, {
            status: res.status,
          })
        })
        .catch((err: any) => {
          return NextResponse.json(err.response.data, {
            status: err.response.data.status,
          })
        })
    })
    .catch((err: any) => {
      return NextResponse.json(err.response.data, {
        status: err.response.status,
      })
    })
}
