import './globals.css'
import type { Metadata } from 'next'
import React from 'react'
// eslint-disable-next-line camelcase
import { Open_Sans, Poppins } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'

const font = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--display-poppins',
})
const sansFont = Open_Sans({
  weight: ['300', '400', '600', '700'],
  subsets: ['latin'],
  variable: '--display-sans',
})

export const metadata: Metadata = {
  title: 'Marca Blanca Creditos',
  description: '¿Necesitas capital para tu negocio o emprendimiento?',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className={`${font.variable} ${sansFont.variable}`}>
      <body className='font-sans'>
        <NextTopLoader color='#01b8e5' showSpinner={false} />
        {children}
      </body>
    </html>
  )
}
