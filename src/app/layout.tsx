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
  title: 'OpenFintek - Créditos Digitales',
  description: 'Necesitas capital para tu negocio o emprendimiento?',
  icons: {
    icon: '/images/logo_openfintek.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='es' className={`${font.variable} ${sansFont.variable}`}>
      <head>
        <meta charSet='utf-8' />
        <link rel='icon' href='/images/logo_openfintek.png' />
      </head>
      <body className='font-sans'>
        <NextTopLoader color='#01b8e5' showSpinner={false} />
        {children}
      </body>
    </html>
  )
}
