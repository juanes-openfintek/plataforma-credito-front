import { useFormik } from 'formik'
import ThreeColumnInputs from '../ThreeColumnInputs/ThreeColumnInputs'
import { CreditData } from '../../../interfaces/creditData.interface'

interface IAdminUserCreditBlockProps {
  creditUserData: CreditData
}

const AdminUserCreditBlock = ({
  creditUserData,
}: IAdminUserCreditBlockProps) => {
  /**
   * Formik instance to manage the forms
   */
  const formik = useFormik({
    initialValues: {
      firstNamePersonalInfo: creditUserData?.name ?? '',
      middleNamePersonalInfo: creditUserData?.secondName ?? '',
      lastNamePersonalInfo: creditUserData?.lastname ?? '',
      secondLastNamePersonalInfo: creditUserData?.secondLastname ?? '',
      phonePersonalInfo: creditUserData?.phoneNumber ?? '',
      emailPersonalInfo: creditUserData?.email,
      birthDatePersonalInfo: creditUserData?.dateOfBirth?.split('T')[0] ?? '',
      typeDocument: creditUserData?.documentType ?? '',
      documentNumber: creditUserData?.documentNumber ?? '',
      ecoActivityWorkInfo: creditUserData?.economicActivity ?? '',
      nameCompanyWorkInfo: creditUserData?.nameCompany ?? '',
      telCompanyWorkInfo: creditUserData?.phoneNumberCompany ?? '',
      addressCompanyWorkInfo: creditUserData?.addressCompany ?? '',
      jobTitleWorkInfo: creditUserData?.positionCompany ?? '',
      contractKindWorkInfo: creditUserData?.typeContract ?? '',
      initialWorkDateWorkInfo: creditUserData?.dateOfAdmission?.split('T')[0] ?? '',
      monthIngressFinancialInfo: creditUserData?.monthlyIncome ?? '',
      monthEgressFinancialInfo: creditUserData?.monthlyExpenses ?? '',
      creditExperienceFinancialInfo: creditUserData?.experienceCredit ?? '',
      disbursementFinancialInfo: creditUserData?.disburserMethod ?? '',
      completeNameReference: creditUserData?.nameReferencePersonal ?? '',
      relationshipReference: creditUserData?.parentescoReferencePersonal ?? '',
      departmentReference: creditUserData?.departamentReferencePersonal ?? '',
      municipalityReference: creditUserData?.municipalityReferencePersonal ?? '',
      phoneReference: creditUserData?.phoneNumberReferencePersonal ?? '',
      taxes: '',
    },
    onSubmit: async (values) => {},
  })

  /**
   * Array of objects to manage the personal information inputs
   */
  const personalInfo = [
    {
      value: formik.values.firstNamePersonalInfo,
      errors: formik.errors.firstNamePersonalInfo,
      type: 'text',
      label: 'Primer nombre*',
      name: 'firstNamePersonalInfo',
      readonly: true,
    },
    {
      value: formik.values.middleNamePersonalInfo,
      errors: formik.errors.middleNamePersonalInfo,
      type: 'text',
      label: 'Segundo nombre',
      name: 'middleNamePersonalInfo',
      readonly: true,
    },
    {
      value: formik.values.lastNamePersonalInfo,
      errors: formik.errors.lastNamePersonalInfo,
      type: 'text',
      label: 'Primer apellido*',
      name: 'lastNamePersonalInfo',
      readonly: true,
    },
    {
      value: formik.values.secondLastNamePersonalInfo,
      errors: formik.errors.secondLastNamePersonalInfo,
      type: 'text',
      label: 'Segundo apellido*',
      name: 'secondLastNamePersonalInfo',
      readonly: true,
    },
    {
      value: formik.values.phonePersonalInfo,
      errors: formik.errors.phonePersonalInfo,
      type: 'text',
      label: 'Número de celular*',
      name: 'phonePersonalInfo',
      readonly: true,
    },
    {
      value: formik.values.emailPersonalInfo,
      errors: formik.errors.emailPersonalInfo,
      type: 'text',
      label: 'Correo electrónico*',
      name: 'emailPersonalInfo',
      readonly: true,
    },
    {
      value: formik.values.birthDatePersonalInfo,
      errors: formik.errors.birthDatePersonalInfo,
      type: 'date',
      placeholder: '10 / 10 / 1993',
      label: 'Fecha de nacimiento*',
      name: 'birthDatePersonalInfo',
      readonly: true,
    },
    {
      value: formik.values.typeDocument,
      errors: formik.errors.typeDocument,
      type: 'text',
      label: 'Tipo de documento de identidad*',
      name: 'typeDocument',
      readonly: true,
    },
    {
      value: formik.values.documentNumber,
      errors: formik.errors.documentNumber,
      type: 'text',
      label: 'Documento de identidad*',
      name: 'documentNumber',
      readonly: true,
    },
  ]
  const workInfo = [
    {
      value: formik.values.ecoActivityWorkInfo,
      errors: formik.errors.ecoActivityWorkInfo,
      type: 'text',
      label: 'Actividad económica*',
      name: 'ecoActivityWorkInfo',
      readonly: true,
    },
    {
      value: formik.values.nameCompanyWorkInfo,
      errors: formik.errors.nameCompanyWorkInfo,
      type: 'text',
      label: 'Nombre de la empresa*',
      name: 'nameCompanyWorkInfo',
      readonly: true,
    },
    {
      value: formik.values.telCompanyWorkInfo,
      errors: formik.errors.telCompanyWorkInfo,
      type: 'text',
      label: 'Teléfono de la empresa*',
      name: 'telCompanyWorkInfo',
      readonly: true,
    },
    {
      value: formik.values.addressCompanyWorkInfo,
      errors: formik.errors.addressCompanyWorkInfo,
      type: 'text',
      label: 'Dirección de la empresa*',
      name: 'addressCompanyWorkInfo',
      readonly: true,
    },
    {
      value: formik.values.jobTitleWorkInfo,
      errors: formik.errors.jobTitleWorkInfo,
      type: 'text',
      label: 'Cargo*',
      name: 'jobTitleWorkInfo',
      readonly: true,
    },
    {
      value: formik.values.contractKindWorkInfo,
      errors: formik.errors.contractKindWorkInfo,
      type: 'text',
      label: 'Tipo de contrato*',
      name: 'contractKindWorkInfo',
      readonly: true,
    },
    {
      value: formik.values.initialWorkDateWorkInfo,
      errors: formik.errors.initialWorkDateWorkInfo,
      type: 'date',
      placeholder: '10 / 10 / 1993',
      label: 'Fecha de vinculación laboral*',
      name: 'initialWorkDateWorkInfo',
      readonly: true,
    },
  ]
  const financialInfo = [
    {
      value: formik.values.monthIngressFinancialInfo,
      errors: formik.errors.monthIngressFinancialInfo,
      type: 'text',
      label: 'Ingresos mensuales*',
      name: 'monthIngressFinancialInfo',
      readonly: true,
    },
    {
      value: formik.values.monthEgressFinancialInfo,
      errors: formik.errors.monthEgressFinancialInfo,
      type: 'text',
      label: 'Egresos mensuales*',
      name: 'monthEgressFinancialInfo',
      readonly: true,
    },
    {
      value: formik.values.creditExperienceFinancialInfo,
      errors: formik.errors.creditExperienceFinancialInfo,
      type: 'text',
      label: 'Experiencia crediticia*',
      name: 'creditExperienceFinancialInfo',
      readonly: true,
    },
    {
      value: formik.values.disbursementFinancialInfo,
      errors: formik.errors.disbursementFinancialInfo,
      type: 'text',
      label: 'Forma de desembolso*',
      name: 'disbursementFinancialInfo',
      readonly: true,
    },
  ]
  const referencesInfo = [
    {
      value: formik.values.completeNameReference,
      errors: formik.errors.completeNameReference,
      type: 'text',
      label: 'Nombres y apellidos*',
      name: 'completeNameReference',
      readonly: true,
    },
    {
      value: formik.values.relationshipReference,
      errors: formik.errors.relationshipReference,
      type: 'text',
      label: 'Parentesco*',
      name: 'relationshipReference',
      readonly: true,
    },
    {
      value: formik.values.departmentReference,
      errors: formik.errors.departmentReference,
      type: 'text',
      label: 'Departamento de residencia*',
      name: 'departmentReference',
      readonly: true,
    },
    {
      value: formik.values.municipalityReference,
      errors: formik.errors.municipalityReference,
      type: 'text',
      label: 'Municipio de residencia*',
      name: 'municipalityReference',
      readonly: true,
    },
    {
      value: formik.values.phoneReference,
      errors: formik.errors.phoneReference,
      type: 'text',
      label: 'Número de teléfono*',
      name: 'phoneReference',
      readonly: true,
    },
  ]
  return (
    <>
      <h2 className='text-[1.5625rem] font-semibold my-4 mt-12'>
        Información del usuario
      </h2>
      <form
        onSubmit={formik.handleSubmit}
        className='bg-light-color-one px-6 lg:px-10 w-full rounded-2xl'
      >
        <ThreeColumnInputs
          fields={personalInfo}
          title='Información personal'
          onHandleChange={formik.handleChange}
        />
        <ThreeColumnInputs
          fields={workInfo}
          title='Información laboral'
          onHandleChange={formik.handleChange}
        />
        <ThreeColumnInputs
          fields={financialInfo}
          title='Información financiera'
          onHandleChange={formik.handleChange}
        />
        <ThreeColumnInputs
          fields={referencesInfo}
          title='Referencias'
          noLowerLine
          onHandleChange={formik.handleChange}
        />
      </form>
    </>
  )
}

export default AdminUserCreditBlock
