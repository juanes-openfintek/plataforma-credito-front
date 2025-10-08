import { useRef } from 'react'
import { CreditData } from '../../../interfaces/creditData.interface'
import SquareButton from '../../atoms/SquareButton/SquareButton'
import ThreeColumnInputs from '../ThreeColumnInputs/ThreeColumnInputs'
import { convertNumberToCurrency } from '../../../helpers/calculationsHelpers'
import decryptCryptoData from '../../../helpers/decryptCryptoData'
import formatDateAdmin from '../../../helpers/formatDateAdmin'

interface AdminUserShortCreditBlockProps {
  creditUserData: CreditData
}

const AdminUserShortCreditBlock = ({
  creditUserData,
}: AdminUserShortCreditBlockProps) => {
  /**
   * Reference to the div that contains the forms to print
   */
  const inputRef = useRef<HTMLDivElement | null>(null)
  /**
   * Array of objects to manage the personal information inputs
   */
  const personalInfo = [
    {
      value: `${creditUserData?.name} ${creditUserData?.secondName}` ?? '',
      errors: '',
      type: 'text',
      label: 'Nombres completos',
      name: 'FullName',
      readonly: true,
    },
    {
      value:
        `${creditUserData?.lastname} ${creditUserData?.secondLastname}` ?? '',
      errors: '',
      type: 'text',
      label: 'Apellidos completos',
      name: 'FullLastName',
      readonly: true,
    },
    {
      value: creditUserData?.user?.documentNumber ?? '',
      errors: '',
      type: 'text',
      label: 'Número de documento',
      name: 'DocumentNumber',
      readonly: true,
    },
    {
      value: creditUserData?.phoneNumber ?? '',
      errors: '',
      type: 'text',
      label: 'Número de celular',
      name: 'PhoneNumber',
      readonly: true,
    },
    {
      value: creditUserData?.user?.email ?? '',
      errors: '',
      type: 'text',
      label: 'Correo eletrónico',
      name: 'Email',
      readonly: true,
    },
    {
      value:
        formatDateAdmin(creditUserData?.dateOfBirth ?? '', 'onlyDate') ?? '',
      errors: '',
      type: 'text',
      label: 'Fecha de nacimiento',
      name: 'DateOfBirth',
      readonly: true,
    },
  ]
  /**
   * Array of objects to manage the disburse information inputs
   */
  const disburseInfo = [
    {
      value: convertNumberToCurrency(creditUserData?.amount ?? 0),
      errors: '',
      type: 'text',
      label: 'Cantidad a desembolsar',
      name: 'DisburseQuantity',
      readonly: true,
    },
    {
      value: decryptCryptoData(creditUserData?.account?.accountNumber ?? ''),
      errors: '',
      type: 'text',
      label: 'Cuenta a desembolsar',
      name: 'AccountToDisburse',
      readonly: true,
    },
    {
      value: 'Mono',
      errors: '',
      type: 'text',
      label: 'Banco que envía',
      name: 'BankToSend',
      readonly: true,
    },
    {
      value: creditUserData?.account?.accountEntity ?? '',
      errors: '',
      type: 'text',
      label: 'Banco que recibe',
      name: 'PhoneNumber',
      readonly: true,
    },
    {
      value: creditUserData?.identificationNumber,
      errors: '',
      type: 'text',
      label: 'Número de identidad del representante',
      name: 'AssessorIdentityNumber',
      readonly: true,
    },
    {
      value: creditUserData?.commission,
      errors: '',
      type: 'text',
      label: 'Comisión por transacción',
      name: 'CommissionForTransaction',
      readonly: true,
    },
  ]
  /**
   * Function to print the form
   */
  const printForm = () => {
    if (inputRef.current) {
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      document.body.appendChild(iframe)

      const contentToPrint = inputRef.current.innerHTML
        .replaceAll('-primary-color', '-purple-800')
        .replaceAll('-light-color-one', '-gray-100')

      if (iframe.contentDocument && iframe.contentWindow) {
        iframe.contentDocument.open()
        iframe.contentDocument.write(
          '<html><head><link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"><style>:root {--primary-color: #01b8e5;}</style></head><body>'
        )
        iframe.contentDocument.write(contentToPrint)
        iframe.contentDocument.write('</body></html>')
        iframe.contentDocument.close()
        iframe.contentWindow.print()
      }

      setTimeout(function () {
        document.body.removeChild(iframe)
      }, 1000)
    }
  }

  return (
    <>
      <h2 className='text-[1.5625rem] font-semibold my-4 mt-12'>
        Información del usuario
      </h2>
      <div ref={inputRef}>
        <div className='bg-light-color-one px-6 pb-2 lg:px-10 w-full rounded-2xl'>
          <ThreeColumnInputs
            fields={personalInfo}
            title='Información cliente'
          />
          <ThreeColumnInputs
            fields={disburseInfo}
            title='Información para desembolso'
          />
        </div>
      </div>

      <div className='m-auto w-[250px] h-[70px] my-14'>
        <SquareButton text='Imprimir' onClickHandler={() => printForm()} />
      </div>
    </>
  )
}

export default AdminUserShortCreditBlock
