'use client'
import { RegisterForm } from '../components/molecules/RegisterForm/RegisterForm'
import LoginView from '../components/organisms/LoginView/LoginView'
import RegisterFields from '../components/organisms/RegisterFields/RegisterFields'
import { useRegisterState } from '../context/registerContext'

export default function LoginPage() {
  /**
   * State to manage the visibility of the login form
   */
  const { registerData } = useRegisterState()

  return (
    <main>
      {registerData.password === '' && (
        <LoginView>
          <RegisterForm />
        </LoginView>
      )}
      {registerData.password !== '' && <RegisterFields />}
    </main>
  )
}
