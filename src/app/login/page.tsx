'use client'
import { LoginForm } from '../components/molecules/LoginForm/LoginForm'
import LoginView from '../components/organisms/LoginView/LoginView'

export default function LoginPage() {
  return (
    <main>
      <LoginView>
        <LoginForm />
      </LoginView>
    </main>
  )
}
