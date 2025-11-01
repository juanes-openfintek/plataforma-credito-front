'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface CommercialAuthContextType {
  isAuthenticated: boolean
  user: string | null
  token: string | null
  loading: boolean
  login: (usuario: string, codigo: string) => Promise<boolean>
  logout: () => void
}

const CommercialAuthContext = createContext<CommercialAuthContextType | undefined>(undefined)

export const useCommercialAuth = () => {
  const context = useContext(CommercialAuthContext)
  if (!context) {
    throw new Error('useCommercialAuth must be used within CommercialAuthProvider')
  }
  return context
}

interface CommercialAuthProviderProps {
  children: ReactNode
}

export const CommercialAuthProvider = ({ children }: CommercialAuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Credenciales demo
  const DEMO_USUARIO = 'comercial'
  const DEMO_CODIGO = '123456'

  useEffect(() => {
    // Verificar si hay sesión activa (solo en el cliente)
    if (typeof window !== 'undefined') {
      const storedToken = sessionStorage.getItem('comercial_token')
      const storedUser = sessionStorage.getItem('comercial_user')
      
      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(storedUser)
        setIsAuthenticated(true)
      }
      setLoading(false)
    }
  }, [])

  const login = async (usuario: string, codigo: string): Promise<boolean> => {
    // Validación demo - en producción esto debería llamar a un API
    if (usuario === DEMO_USUARIO && codigo === DEMO_CODIGO) {
      const mockToken = `demo-token-${Date.now()}`
      
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('comercial_token', mockToken)
        sessionStorage.setItem('comercial_user', usuario)
        sessionStorage.setItem('comercial_user_data', JSON.stringify({
          usuario,
          nombre: 'Comercial Demo',
          email: 'comercial@demo.com',
        }))
      }

      setToken(mockToken)
      setUser(usuario)
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('comercial_token')
      sessionStorage.removeItem('comercial_user')
      sessionStorage.removeItem('comercial_user_data')
    }
    
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    router.push('/registro-comercial')
  }

  return (
    <CommercialAuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </CommercialAuthContext.Provider>
  )
}

