import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='text-center flex flex-col justify-center items-center h-[100vh]'>
      <h2 className='text-[10rem] text-primary-color font-poppins'>404</h2>
      <p className='text-[1.5rem] text-primary-color'>No se ha encontrado la página</p>
      <Link href='/' className='text-[1rem] text-primary-color underline'>Regresa a la página principal</Link>
    </div>
  )
}
