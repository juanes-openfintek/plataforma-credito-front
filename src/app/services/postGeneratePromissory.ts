import { signOut } from 'next-auth/react'
// import getUserToken from '../helpers/getUserToken'
import axios from 'axios'

const postGeneratePromissory = async (data: FormData) => {
  try {
    // TODO: get token from session
    // const token = await getUserToken()
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOnsidXNlciI6eyJ0ZXJtcyI6MCwiX2lkIjoiNjU1OTQ2Y2I0YTA5ZjIwMDRhNzU1YjZjIiwiZnVsbE5hbWUiOiJOaWNvbGFzIFN1YXJleiIsImZpcnN0TmFtZSI6Ik5pY29sYXMiLCJsYXN0TmFtZSI6IlN1YXJleiIsImlkZW50aWZpY2F0aW9uIjoiMTAyMzk3NDc2NyIsImNlbGxwaG9uZSI6IjM1MDc4NDUxMjEiLCJlbWFpbCI6Im5pa3N1cm9MT0xAZ21haWwuY29tIiwiY291bnRyeSI6IkNPIiwiY2l0eSI6IkJvZ290YSIsImV4cGVkaXRpb25EYXRlIjoiMjAxNy0wMi0xNlQwNTowMDowMC4wMDBaIiwiZXhwZWRpdGlvbkNpdHkiOiJCb2dvdGEiLCJtb3JlIjp7Im51bWJlciI6IjM1MCA3ODQ1MTIxIiwiaW50ZXJuYXRpb25hbE51bWJlciI6Iis1NyAzNTAgNzg0NTEyMSIsIm5hdGlvbmFsTnVtYmVyIjoiMzUwIDc4NDUxMjEiLCJlMTY0TnVtYmVyIjoiKzU3MzUwNzg0NTEyMSIsImNvdW50cnlDb2RlIjoiQ08iLCJkaWFsQ29kZSI6Iis1NyJ9LCJjcmVhdGVkQXQiOiIyMDIzLTExLTE4VDIzOjIwOjQzLjMyOVoiLCJ1cGRhdGVkQXQiOiIyMDIzLTExLTE4VDIzOjIwOjQzLjMyOVoiLCJfX3YiOjB9LCJvcmdhbml6YXRpb24iOnsiYXNzZXRDb3VudCI6NDE5LCJkb2N1bWVudFBheUNvdW50IjoxMDAwMCwiX2lkIjoiNjFmYjA5NDI0ZTRhZGYwMDFmZWU1MWE5IiwiYnVzaW5lc3NOYW1lIjoiQVJLRElBIiwidHJpYnV0YXJ5TnVtYmVyIjoiOTAxMTY5Nzg2NSIsImNvdW50cnkiOiJDTyIsImNpdHkiOiJCT0dPVEEiLCJhY3RpdmUiOiIxIiwicGxhbiI6MSwiZW1haWwiOiJub3RpZmljYWNpb25lc0BhcmtkaWEuY28iLCJwaG9uZSI6IjM1MDUzNjA2MDYiLCJhZGRyZXNzIjoiQ2FycmVyYSAxMUIgIzk4LTA4IE9maWNpbmEgNDAzIiwid2ViU2l0ZSI6ImFya2RpYS5jbyIsImlkZW50aXR5IjoiNjFmOTlmZDk3NDRlZDUwMDFmMDhhODM1IiwibGVnYWxFbnRpdHkiOiJqdXJpZGljYSIsImNyZWF0ZWRBdCI6IjIwMjItMDItMDJUMjI6NDQ6MTguOTcyWiIsInVwZGF0ZWRBdCI6IjIwMjMtMTEtMThUMjM6MTk6MDQuMTI0WiIsIl9fdiI6MCwiZXhwaXJlc0FjdGl2ZSI6IjIwMjUtMTEtMzBUMTY6MjM6NTUuOTU0WiIsImxvZ28iOiIvaG9tZS9hcGkvcmVwb3NpdG9yaWVzLzYxZmIwOTQyNGU0YWRmMDAxZmVlNTFhOS9sb2dvL3VwbG9hZF8xYThkN2FkMjZlZmJmZDVhMTEzNGEwMjVkNzAxYmYzOCIsImNvbnN0aXR1dGlvbkRhdGUiOm51bGwsImZvb3RlciI6Imh0dHBzOi8vZHJpdmUuZ29vZ2xlLmNvbS9maWxlL2QvMXJyeUZrUVFMbWZnQ1VQT3I1OXZlNVpOWDhHdEctOFpXL3ZpZXc_dXNwPWRyaXZlX2xpbmsiLCJoZWFkZXIiOiJodHRwczovL2RyaXZlLmdvb2dsZS5jb20vZmlsZS9kLzFEdlpDak1HTlVXNl9BbTdKd3h0RnR1WEFycVZSMzRoay92aWV3P3VzcD1kcml2ZV9saW5rIiwibG9nb1VybCI6Imh0dHBzOi8vZHJpdmUuZ29vZ2xlLmNvbS9maWxlL2QvMVBubWx5bmpUYUwweTA0Y0EteGJUN0FyQ21DSHo3bi1kL3ZpZXc_dXNwPWRyaXZlX2xpbmsifX0sImlhdCI6MTcwMDM0OTY0MywiZXhwIjoxNzMxODg1NjQzfQ.VQdphp-MSLAQd8F7wM930dn6R0Jx6NNzGHGEsK6G7Lc'
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_ARKDIA + '/v1/bpo/asset/asset-api',
      data,
      {
        headers: {
          'x-security-token': process.env.NEXT_PUBLIC_SECURITY_TOKEN,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      }
    )
    return response
  } catch (error: any) {
    console.error('Error fetching data:', error)
    if (error?.response?.status === 401) {
      signOut()
    }
    return error.response
  }
}

export default postGeneratePromissory
