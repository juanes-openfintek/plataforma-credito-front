/* eslint-disable no-undef */
'use client'
import { useRef, useState } from 'react'
import NextImage from '../NextImage/NextImage'
import checkFileFormat from '../../../helpers/checkFileFormat'
import Link from 'next/link'

interface LoadDocumentProps {
  file: any
  setFile: React.Dispatch<React.SetStateAction<any>>
  existingFile?: string
}
/**
 * LoadDocument is a component that renders a button to upload a document
 * @param {Function} setFile - The function to set the file
 * @example <LoadDocument setFile={setFile} />
 * @returns The LoadDocument component
 */
const LoadDocument = ({ file, setFile, existingFile }: LoadDocumentProps) => {
  /**
   * @description This is a reference to the input file
   */
  const hiddenFileInput = useRef<any>(null)
  /**
   * @description This is the state of the error
   */
  const [error, setError] = useState<string>('')

  /**
   * @description This function is used to open the file explorer
   * @param event - The event of the click
   */
  const handleClick = (event: any) => {
    hiddenFileInput.current.click()
  }
  const formats = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
  return (
    <div className='flex flex-col'>
      <h4 className='text-[1.5625rem] mb-10'>Cargar documento</h4>
      <input
        type='file'
        ref={hiddenFileInput}
        name='fileInput'
        id='fileInput'
        accept='application/pdf, image/jpeg, image/png, image/jpg'
        onChange={async (event: any) => {
          const file = event?.currentTarget?.files[0]
          if (file?.size > 5000000) {
            setError('El archivo no puede ser mayor a 5MB')
            return
          }
          if (await checkFileFormat(file, formats)) {
            setFile(file)
            setError('')
            return
          }
          setError('Formato no válido')
        }}
        className='hidden'
      />
      <div className='flex flex-col md:flex-row items-center'>
        {existingFile && !file?.type && (
          <Link href={existingFile} target='_blank'>
            <NextImage
              src='/images/pdf-icon.png'
              alt='upload'
              width={310}
              height={50}
            />
          </Link>
        )}
        {!existingFile && !file?.type && (
          <NextImage
            src='/images/pdf-icon.png'
            alt='upload'
            width={310}
            height={50}
          />
        )}
        {file?.type && (
          <p className='bg-primary-color text-white font-[2rem] px-8 py-6 rounded-xl'>{file?.name}</p>
        )}
        <button
          className='bg-light-color-two rounded-md text-white border-radius-13 h-[72px] mx-6 max-md:my-6 w-[220px]'
          onClick={handleClick}
        >
          {file || existingFile ? 'Volver a cargar' : 'Subir'}
        </button>
      </div>
      <p className='text-error-color '>{error}</p>
    </div>
  )
}

export default LoadDocument
