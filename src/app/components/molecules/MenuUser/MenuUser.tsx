'use client'
import Link from 'next/link'
import NextImage from '../../atoms/NextImage/NextImage'
import { signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import useDecryptedSession from '../../../hooks/useDecryptedSession'
import axios from 'axios'
import decryptData from '../../../helpers/decryptData'

/**
 * MenuUser is a component that renders the menu of the user pages
 * @example <MenuUser />
 * @returns The MenuUser component
 */
const MenuUser = () => {
  /**
   * update is the function to update the session in NextAuth
   */
  const { update } = useSession()
  /**
   * userData is the data of the user
   */
  const userData: any = useDecryptedSession()
  /**
   * path is the path of the page
   */
  const path = usePathname()
  /**
   * role is the role of the user
   */
  const role: string = userData?.roles ?? ''
  /**
   * useEffect to fetch the data
   */
  useEffect(() => {
    if (userData?.token && !sessionStorage.getItem('fetched')) {
      fetchData()
    }
  }, [userData])

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  /**
   * @description This function is used to fetch the data from use to know if the token expires
   */
  const fetchData = async () => {
    const data: any = await axios
      .post('/api/auth/validate', {
        token: userData?.token,
      })
      .then((res) => {
        sessionStorage.setItem('fetched', 'true')
        return res.data
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          signOut()
        }
      })
    const decipheredData = decryptData(data)
    update({
      email: decipheredData.email,
      emailVerified: decipheredData.emailVerified,
      isActive: decipheredData.isActive,
      lastname: decipheredData.lastname,
      name: decipheredData.name,
      roles: decipheredData.roles,
      token: decipheredData.token,
      uid: decipheredData.uid,
      _id: decipheredData._id,
    })
  }
  return (
    <div>
      {isMenuOpen && (
        <div
          className='w-[100vw] h-[100vh] bg-light-color-two opacity-80 fixed top-0 left-0 xl:pl-[300px] z-10'
          onClick={() => setIsMenuOpen(false)}
        />
      )}{' '}
      <div className='flex fixed justify-between items-center bg-white py-2 px-20 max-lg:px-0 max-lg:justify-center w-screen shadow-md font-semibold text-base z-20 lg:hidden'>
        <NextImage
          src='/images/openfintek-logo.png'
          alt='OpenFintek logo'
          width={100}
          height={30}
          className='object-contain max-h-8'
        />
        <span className='icon-bars-solid text-[1.125rem] absolute right-5 lg:hidden' onClick={() => setIsMenuOpen(!isMenuOpen)} />
      </div>
      <div
        className={`h-screen w-[260px] bg-primary-color fixed pt-10 pb-[10rem] rounded-r-3xl flex flex-col justify-between text-white font-semibold text-[1.375rem] leading-[1.5625rem] z-30 ${
          isMenuOpen ? '' : 'max-lg:hidden'
        }`}
      >
        <NextImage
          className='mx-auto filter brightness-0 invert object-contain max-h-12'
          src='/images/openfintek-logo.png'
          alt='OpenFintek logo'
          width={140}
          height={45}
        />
        <nav
          className={`flex flex-col ${
            role.includes('user') && role.length === 1
              ? 'justify-between'
              : 'justify-center gap-8'
          } h-1/2 w-full`}
        >
          {role.includes('user') && role.length <= 1 && (
            <Link
              className={`flex flex-row items-center ${
                path === '/usuario'
                  ? 'bg-white ml-4 pl-10 py-4 rounded-s-xl text-primary-color'
                  : 'ml-14'
              }`}
              href='/usuario'
            >
              <span
                className={`icon-house text-[1.5rem] mr-4 w-[25px] text-center ${
                  path === '/usuario' ? 'text-primary-color' : ''
                }`}
              />
              Inicio
            </Link>
          )}
          {role.includes('approver') && role.length <= 2 && (
            <Link
              className={`flex flex-row items-center ${
                path === '/aprobador'
                  ? 'bg-white ml-4 pl-10 py-4 rounded-s-xl text-primary-color'
                  : 'ml-14'
              }`}
              href='/aprobador'
            >
              <span
                className={`icon-house text-[1.5rem] mr-4 w-[25px] text-center ${
                  path === '/aprobador' ? 'text-primary-color' : ''
                }`}
              />
              Inicio
            </Link>
          )}
          {role.includes('user') && role.length <= 1 && (
            <Link
              className={`flex flex-row items-center ${
                path.includes('/usuario/creditos')
                  ? 'bg-white ml-4 pl-10 py-4 rounded-s-xl text-primary-color'
                  : 'ml-14'
              }`}
              href='/usuario/creditos'
            >
              <span
                className={`icon-bouletin text-[1.5rem] mr-4 w-[25px] text-center ${
                  path.includes('/usuario/creditos') ? 'text-primary-color' : ''
                }`}
              />
              Créditos
            </Link>
          )}
          {role.includes('admin') && (
            <Link
              className={`flex flex-row items-center ${
                path === '/admin'
                  ? 'bg-white ml-4 pl-10 py-4 rounded-s-xl text-primary-color'
                  : 'ml-14'
              }`}
              href='/admin'
            >
              <span
                className={`icon-house text-[1.5rem] mr-4 w-[25px] text-center ${
                  path === '/admin' ? 'text-primary-color' : ''
                }`}
              />
              Créditos
            </Link>
          )}
          {role.includes('approver') && role.length <= 2 && (
            <Link
              className={`flex flex-row items-center ${
                path.includes('/aprobador/creditos')
                  ? 'bg-white ml-4 pl-10 py-4 rounded-s-xl text-primary-color'
                  : 'ml-14'
              }`}
              href='/aprobador/creditos'
            >
              <span
                className={`icon-bouletin text-[1.5rem] mr-4 w-[25px] text-center ${
                  path.includes('/aprobador/creditos')
                    ? 'text-primary-color'
                    : ''
                }`}
              />
              Créditos
            </Link>
          )}
          {role.includes('disburser') && role.length <= 2 && (
            <Link
              className={`flex flex-row items-center ${
                path.includes('/desembolsador')
                  ? 'bg-white ml-4 pl-10 py-4 rounded-s-xl text-primary-color'
                  : 'ml-14'
              }`}
              href='/desembolsador'
            >
              <span
                className={`icon-bouletin text-[1.5rem] mr-4 w-[25px] text-center ${
                  path.includes('/desembolsador') ? 'text-primary-color' : ''
                }`}
              />
              Créditos
            </Link>
          )}
          {role.includes('user') && role.length <= 1 && (
            <Link
              className={`flex flex-row items-center ${
                path.includes('/usuario/perfil')
                  ? 'bg-white ml-4 pl-10 py-4 rounded-s-xl text-primary-color'
                  : 'ml-14'
              }`}
              href='/usuario/perfil'
            >
              <span
                className={`icon-user text-[1.5rem] mr-4 w-[25px] text-center ${
                  path.includes('/usuario/perfil') ? 'text-primary-color' : ''
                }`}
              />
              Perfil
            </Link>
          )}
          {role.includes('user') && role.length <= 1 && (
            <Link
              className={`flex flex-row items-center ${
                path.includes('/usuario/pagos')
                  ? 'bg-white ml-4 pl-10 py-4 rounded-s-xl text-primary-color'
                  : 'ml-14'
              }`}
              href='/usuario/pagos'
            >
              <span
                className={`icon-attach-money text-[1.5rem] mr-4 w-[25px] text-center ${
                  path.includes('/usuario/pagos') ? 'text-primary-color' : ''
                }`}
              />
              Pagos
            </Link>
          )}
          {role.includes('user') && role.length <= 1 && (
            <Link
              className={`flex flex-row items-center ${
                path.includes('/usuario/notificaciones')
                  ? 'bg-white ml-4 pl-10 py-4 rounded-s-xl text-primary-color'
                  : 'ml-14'
              }`}
              href='/usuario/notificaciones'
            >
              <span
                className={`icon-circle-bell text-[1.5rem] mr-4 w-[25px] text-center ${
                  path.includes('/usuario/notificaciones')
                    ? 'text-primary-color'
                    : ''
                }`}
              />
              Notificación
            </Link>
          )}
          {role.includes('admin') && (
            <Link
              className={`flex flex-row items-center ${
                path.includes('/admin/estadisticas')
                  ? 'bg-white ml-4 pl-10 py-4 rounded-s-xl text-primary-color'
                  : 'ml-14'
              }`}
              href='/admin/estadisticas'
            >
              <span
                className={`icon-chart text-[1.5rem] mr-4 w-[25px] text-center ${
                  path.includes('/admin/estadisticas')
                    ? 'text-primary-color'
                    : ''
                }`}
              />
              Estadísticas
            </Link>
          )}
          {role.includes('admin') && (
            <Link
              className={`flex flex-row items-center ${
                path.includes('/admin/control')
                  ? 'bg-white ml-4 pl-10 py-4 rounded-s-xl text-primary-color'
                  : 'ml-14'
              }`}
              href='/admin/control'
            >
              <span
                className={`icon-user text-[1.5rem] mr-4 w-[25px] text-center ${
                  path.includes('/admin/control') ? 'text-primary-color' : ''
                }`}
              />
              Control
            </Link>
          )}
          {role.includes('admin') && (
            <Link
              className={`flex flex-row items-center ${
                path.includes('/admin/tasas')
                  ? 'bg-white ml-4 pl-10 py-4 rounded-s-xl text-primary-color'
                  : 'ml-14'
              }`}
              href='/admin/tasas'
            >
              <span
                className={`icon-article text-[1.5rem] mr-4 w-[25px] text-center ${
                  path.includes('/admin/tasas') ? 'text-primary-color' : ''
                }`}
              />
              Tasas
            </Link>
          )}
        </nav>
        <div className='flex flex-row items-center ml-14'>
          <span className='icon-out text-[1.5rem] mr-4 w-[25px] text-center' />
          <Link href='' onClick={() => signOut()}>
            Salir
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MenuUser
