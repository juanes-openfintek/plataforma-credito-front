'use client'
import { CommercialLoginForm } from '../components/molecules/CommercialLoginForm/CommercialLoginForm'
import { CommercialAuthProvider } from '../context/CommercialAuthContext'
import LoginView from '../components/organisms/LoginView/LoginView'

export default function RegistroComercialPage() {
  return (
    <CommercialAuthProvider>
      <main>
        <LoginView>
          <div className='w-full'>
            <h1 className='text-3xl font-bold text-gray-800 mb-2 text-center'>
              Portal Comercial
            </h1>
            <p className='text-gray-600 text-center mb-8'>
              Accede a tu portal de gestión de créditos libranza
            </p>
            <CommercialLoginForm />
          </div>
        </LoginView>
      </main>
    </CommercialAuthProvider>
  )
}
