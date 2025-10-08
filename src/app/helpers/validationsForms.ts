import { isMinor } from './checkUserAge'

/* eslint-disable no-useless-escape */
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9-]+\.\w{2,10}[a-zA-Z]*$/
const NUMBER_REGEX = /^[0-9]*$/
const ALPHA_REGEX = /^[a-zA-ZñÑ ]*$/
const WHITESPACE_REGEX = /\s/
const PHONE_REGEX = /^3[0-9]{9,9}$/
const TELEPHONE_REGEX = /^6[0-9]{9,9}$/

/**
 * validate function to manage the formik validation
 * @param values are the values of the form and its types
 * @returns if the form has errors
 */
export const validateCalculator = (values: {
  priceRange: string
  daysRange: string
}) => {
  const errors: any = {}
  const priceValue = parseInt(values?.priceRange, 10)
  const daysValue = parseInt(values?.daysRange, 10)
  if (values.priceRange || !isNaN(priceValue)) {
    if (
      priceValue &&
      (priceValue < Number(process.env.NEXT_PUBLIC_MIN_CREDIT) ||
        priceValue > Number(process.env.NEXT_PUBLIC_MAX_CREDIT))
    ) {
      errors.priceRange = `Debe ingresar un número entre ${process.env.NEXT_PUBLIC_MIN_CREDIT} y ${process.env.NEXT_PUBLIC_MAX_CREDIT}`
    }
  } else {
    errors.priceRange = 'Debe ingresar un valor numérico'
  }
  if (values.daysRange || !isNaN(daysValue) || daysValue !== 0) {
    if (
      daysValue === 0 ||
      daysValue < 1 ||
      daysValue > Number(process.env.NEXT_PUBLIC_MAX_DAYS)
    ) {
      errors.daysRange = `Debe ingresar un número entre 1 y ${process.env.NEXT_PUBLIC_MAX_DAYS}`
    }
  } else {
    errors.daysRange = 'Debe ingresar un valor numérico'
  }

  return errors
}

/**
 * validateLogin is a function that validates the login form fields fields
 * @example validateLogin(values)
 * @param values - The values of the login form
 * @returns The errors of the login form
 */
export const validateLogin = (values: { email: string; password: string }) => {
  const errors: any = {}
  // Validate email
  if (!EMAIL_REGEX.test(values.email)) {
    errors.email = 'Debe ingresar un correo electrónico válido'
  }
  if (values.password.length < 1) {
    errors.password = 'Debe ingresar una contraseña válida'
    return errors
  }
  return errors
}
/**
 * validateRegister is a function that validates the register form fields
 * @example validateRegister(values)
 * @param values - The values of the register form
 * @returns The errors of the register form
 */
export const validateRegister = (values: {
  email: string
  password: string
  confirmPassword: string
}) => {
  const errors: any = {}
  // Validate email
  if (!EMAIL_REGEX.test(values.email)) {
    errors.email = 'Debe ingresar un correo electrónico válido'
  }
  // Validate equal passwords
  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
  }
  if (values.password.length < 8) {
    errors.password = 'Su contraseña debe tener al menos 8 caracteres'
    return errors
  }

  // Validate uppercase

  const contieneMayúscula = values.password.match(/[A-Z]/)
  if (!contieneMayúscula) {
    errors.password = 'Su contraseña debe tener al menos una mayúscula'
    return errors
  }

  // Validate lowercase

  if (!/[a-z]/.test(values.password)) {
    errors.password = 'Su contraseña debe tener al menos una minúscula'
    return errors
  }

  // Validate number

  const contieneNúmero = values.password.match(/[0-9]/)
  if (!contieneNúmero) {
    errors.password = 'Su contraseña debe tener al menos un número'
    return errors
  }

  // Validate special character

  const contieneCaracterEspecial = values.password.match(
    /[~`!@#$%^&*()_+={}|\[\];:",.<>/?]/
  )
  if (!contieneCaracterEspecial) {
    errors.password = 'Su contraseña debe tener al menos un carácter especial'
    return errors
  }

  if (WHITESPACE_REGEX.test(values.password)) {
    errors.password = 'Evite colocar espacios en blanco en su contraseña'
    return errors
  }

  if (values.password.length > 50) {
    errors.password = 'Evite colocar más de 50 caracteres en su contraseña'
    return errors
  }
  return errors
}
/**
 * validateReset is a function that validates the reset password form fields
 * @example validateReset(values)
 * @param values - The values of the reset form
 * @returns The errors of the reset form
 */
export const validateReset = (values: { email: string }) => {
  const errors: any = {}
  // Validate email
  if (!EMAIL_REGEX.test(values.email)) {
    errors.email = 'Debe ingresar un correo electrónico válido'
  }
  return errors
}

/**
 * validateUserDataRegisterForm is a function that validates the register form fields
 * @example validateUserDataRegisterForm(values)
 * @param values - The values of the register form
 * @returns The errors of the register form
 */
export const validateUserDataRegisterForm = (values: {
  namePersonalInfo: string
  lastNamePersonalInfo: string
  phonePersonalInfo: string
  birthDatePersonalInfo: string
  typeDocument: string
  documentNumber: string
  typeAccount: string
  numberAccount: string
  nameBankAccount: string
}) => {
  const errors: any = {}
  // Validate namePersonalInfo
  if (!ALPHA_REGEX.test(values.namePersonalInfo)) {
    errors.namePersonalInfo = 'Ingresa solo letras'
  }
  if (values.namePersonalInfo.length < 3) {
    errors.namePersonalInfo = 'Este campo es obligatorio'
  }
  // Validate lastNamePersonalInfo
  if (!ALPHA_REGEX.test(values.lastNamePersonalInfo)) {
    errors.lastNamePersonalInfo = 'Ingresa solo letras'
  }
  if (values.lastNamePersonalInfo.length < 3) {
    errors.lastNamePersonalInfo = 'Este campo es obligatorio'
  }
  // Validate phonePersonalInfo
  if (!PHONE_REGEX.test(values.phonePersonalInfo)) {
    errors.phonePersonalInfo = 'Ingresa un número de celular válido'
  }
  if (values.phonePersonalInfo.length < 1) {
    errors.phonePersonalInfo = 'Este campo es obligatorio'
  }
  // Validate birthDatePersonalInfo
  if (values.birthDatePersonalInfo.length < 3) {
    errors.birthDatePersonalInfo = 'Este campo es obligatorio'
  }
  if (isMinor(values.birthDatePersonalInfo)) {
    errors.birthDatePersonalInfo = 'Debe ser mayor de edad para continuar'
  }
  // Validate typeDocument
  if (
    values.typeDocument === '-- Seleccione una opción --' ||
    values.typeDocument === ''
  ) {
    errors.typeDocument = 'Este campo es obligatorio'
  }
  // Validate documentNumber
  if (!NUMBER_REGEX.test(values.documentNumber)) {
    errors.documentNumber = 'Ingresa solo valores númericos'
  }
  if (values.documentNumber.length > 10) {
    errors.documentNumber = 'Ingrese un número de documento válido'
  }
  if (
    values.documentNumber.length === 10 &&
    !(values.documentNumber[0] === '1' || values.documentNumber[0] === '2') &&
    values.typeDocument === 'CC'
  ) {
    errors.documentNumber = 'Ingrese un número de documento válido'
  }
  if (values.documentNumber.length < 2) {
    errors.documentNumber = 'Este campo es obligatorio'
  }
  // Validate typeAccount
  if (
    values.typeAccount === '-- Seleccione una opción --' ||
    values.typeAccount === ''
  ) {
    errors.typeAccount = 'Este campo es obligatorio'
  }
  // Validate numberAccount
  if (!NUMBER_REGEX.test(values.numberAccount)) {
    errors.numberAccount = 'Ingresa solo valores númericos'
  }
  if (values.numberAccount.length < 3) {
    errors.numberAccount = 'Este campo es obligatorio'
  }
  // Validate nameBankAccount
  if (values.nameBankAccount.length < 3) {
    errors.nameBankAccount = 'Este campo es obligatorio'
  }
  return errors
}

/**
 * Validates the personal information of a user.
 * @param values An object containing the user's personal information.
 * @returns An object containing any validation errors.
 */
export const validatePersonaData = (values: {
  firstNamePersonalInfo: string
  middleNamePersonalInfo: string
  lastNamePersonalInfo: string
  secondLastNamePersonalInfo: string
  phonePersonalInfo: string
  emailPersonalInfo: string
  birthDatePersonalInfo: string
  typeDocument: string
  documentNumber: string
}) => {
  const errors: any = {}
  // Validate firstNamePersonalInfo
  if (!ALPHA_REGEX.test(values.firstNamePersonalInfo)) {
    errors.firstNamePersonalInfo = 'Ingresa solo letras'
  }
  if (
    !values.firstNamePersonalInfo ||
    values.firstNamePersonalInfo?.length < 3
  ) {
    errors.firstNamePersonalInfo = 'Este campo es obligatorio'
  }

  // Validate middleNamePersonalInfo
  if (
    values.middleNamePersonalInfo?.length > 0 &&
    !ALPHA_REGEX.test(values.middleNamePersonalInfo)
  ) {
    errors.middleNamePersonalInfo = 'Ingresa solo letras'
  }

  // Validate lastNamePersonalInfo
  if (!ALPHA_REGEX.test(values.lastNamePersonalInfo)) {
    errors.lastNamePersonalInfo = 'Ingresa solo letras'
  }
  if (!values.lastNamePersonalInfo || values.lastNamePersonalInfo?.length < 3) {
    errors.lastNamePersonalInfo = 'Este campo es obligatorio'
  }

  // Validate secondLastNamePersonalInfo
  if (
    values.secondLastNamePersonalInfo?.length > 0 &&
    !ALPHA_REGEX.test(values.secondLastNamePersonalInfo)
  ) {
    errors.secondLastNamePersonalInfo = 'Ingresa solo letras'
  }

  // Validate phonePersonalInfo
  if (!PHONE_REGEX.test(values.phonePersonalInfo)) {
    errors.phonePersonalInfo = 'Ingresa un número de celular válido'
  }
  if (!values.phonePersonalInfo || values.phonePersonalInfo?.length < 1) {
    errors.phonePersonalInfo = 'Este campo es obligatorio'
  }

  // Validate email
  if (!EMAIL_REGEX.test(values.emailPersonalInfo)) {
    errors.emailPersonalInfo = 'Debe ingresar un correo electrónico válido'
  }

  // Validate birthDatePersonalInfo
  if (
    !values.birthDatePersonalInfo ||
    values.birthDatePersonalInfo?.length < 3
  ) {
    errors.birthDatePersonalInfo = 'Este campo es obligatorio'
  }
  if (isMinor(values.birthDatePersonalInfo)) {
    errors.birthDatePersonalInfo = 'Debe ser mayor de edad para continuar'
  }

  // Validate typeDocument
  if (
    values.typeDocument === '-- Seleccione una opción --' ||
    values.typeDocument === '' ||
    !values.typeDocument
  ) {
    errors.typeDocument = 'Este campo es obligatorio'
  }
  // Validate documentNumber
  if (!NUMBER_REGEX.test(values.documentNumber)) {
    errors.documentNumber = 'Ingresa solo valores númericos'
  }
  if (!values.documentNumber || values.documentNumber?.length > 10) {
    errors.documentNumber = 'Ingrese un número de documento válido'
  }
  if (!values.documentNumber || values.documentNumber?.length < 5) {
    errors.documentNumber = 'Este campo es obligatorio'
  }

  return errors
}

/**
 * Validates job information form fields.
 * @param values - Object containing the form field values to be validated.
 * @returns An object containing the validation errors, if any.
 */
export const validateJobInfo = (values: {
  ecoActivityWorkInfo: string
  nameCompanyWorkInfo: string
  telCompanyWorkInfo: string
  addressCompanyWorkInfo: string
  jobTitleWorkInfo: string
  contractKindWorkInfo: string
  initialWorkDateWorkInfo: string
}) => {
  const errors: any = {}
  // Validate ecoActivityWorkInfo
  if (values.ecoActivityWorkInfo.length < 3) {
    errors.ecoActivityWorkInfo = 'Este campo es obligatorio'
  }
  // Validate nameCompanyWorkInfo
  if (values.nameCompanyWorkInfo.length < 3) {
    errors.nameCompanyWorkInfo = 'Este campo es obligatorio'
  }
  // Validate telCompanyWorkInfo
  if (
    !PHONE_REGEX.test(values.telCompanyWorkInfo) &&
    !TELEPHONE_REGEX.test(values.telCompanyWorkInfo)
  ) {
    errors.telCompanyWorkInfo =
      'Ingresa un número de telefónico o celular válido'
  }
  if (values.telCompanyWorkInfo.length < 1) {
    errors.telCompanyWorkInfo = 'Este campo es obligatorio'
  }

  // Validate addressCompanyWorkInfo
  if (values.addressCompanyWorkInfo.length < 3) {
    errors.addressCompanyWorkInfo = 'Este campo es obligatorio'
  }
  // Validate jobTitleWorkInfo
  if (values.jobTitleWorkInfo.length < 3) {
    errors.jobTitleWorkInfo = 'Este campo es obligatorio'
  }
  // Validate contractKindWorkInfo
  if (
    values.contractKindWorkInfo === '-- Seleccione una opción --' ||
    values.contractKindWorkInfo === '' ||
    !values.contractKindWorkInfo
  ) {
    errors.contractKindWorkInfo = 'Este campo es obligatorio'
  }
  // Validate initialWorkDateWorkInfo
  if (values.initialWorkDateWorkInfo.length < 3) {
    errors.initialWorkDateWorkInfo = 'Este campo es obligatorio'
  }
  return errors
}

/**
 * Validates financial data.
 * @param values - Object containing the financial data to be validated.
 * @returns Object containing any validation errors.
 */
export const validateFinancialData = (values: {
  monthIngressFinancialInfo: string
  monthEgressFinancialInfo: string
  creditExperienceFinancialInfo: string
  disbursementFinancialInfo: string
}) => {
  const errors: any = {}
  // Validate monthIngressFinancialInfo
  if (!NUMBER_REGEX.test(values.monthIngressFinancialInfo)) {
    errors.monthIngressFinancialInfo = 'Introduce solo valores numéricos'
  }
  if (values.monthIngressFinancialInfo.length < 1) {
    errors.monthIngressFinancialInfo = 'Este campo es obligatorio'
  }
  // Validate monthEgressFinancialInfo
  if (!NUMBER_REGEX.test(values.monthEgressFinancialInfo)) {
    errors.monthEgressFinancialInfo = 'Introduce solo valores numéricos'
  }
  if (values.monthEgressFinancialInfo.length < 1) {
    errors.monthEgressFinancialInfo = 'Este campo es obligatorio'
  }
  // Validate creditExperienceFinancialInfo
  if (values.creditExperienceFinancialInfo.length < 1) {
    errors.creditExperienceFinancialInfo = 'Este campo es obligatorio'
  }
  // Validate disbursementFinancialInfo
  if (
    values.disbursementFinancialInfo === '-- Seleccione una opción --' ||
    values.disbursementFinancialInfo === '' ||
    !values.disbursementFinancialInfo
  ) {
    errors.disbursementFinancialInfo = 'Este campo es obligatorio'
  }
  return errors
}

/**
 * Validates reference data.
 * @param values - An object containing the reference data to be validated.
 * @returns An object containing the validation errors, if any.
 */
export const validateReferenceData = (values: {
  completeNameReference: string
  relationshipReference: string
  departmentReference: string
  municipalityReference: string
  phoneReference: string
}) => {
  const errors: any = {}
  // Validate completeNameReference
  if (!ALPHA_REGEX.test(values.completeNameReference)) {
    errors.completeNameReference = 'Ingresa solo letras'
  }
  if (values.completeNameReference.length < 3) {
    errors.completeNameReference = 'Este campo es obligatorio'
  }
  // Validate relationshipReference
  if (values.relationshipReference.length < 3) {
    errors.relationshipReference = 'Este campo es obligatorio'
  }
  // Validate departmentReference
  if (values.departmentReference.length < 3) {
    errors.departmentReference = 'Este campo es obligatorio'
  }
  // Validate municipalityReference
  if (values.municipalityReference.length < 3) {
    errors.municipalityReference = 'Este campo es obligatorio'
  }
  // Validate phoneReference
  if (!PHONE_REGEX.test(values.phoneReference)) {
    errors.phoneReference = 'Ingresa un número de celular válido'
  }
  if (values.phoneReference.length < 1) {
    errors.phoneReference = 'Este campo es obligatorio'
  }
  return errors
}

/**
 * Validates the acceptance of terms and data treatment in a form.
 * @param values An object containing the values to be validated.
 * @param values.personalDataCheck A boolean indicating whether the personal data treatment has been accepted.
 * @param values.termsDataCheck A boolean indicating whether the terms and conditions have been accepted.
 * @param values.acceptanceValueCheck A boolean indicating whether the requested value has been accepted.
 * @returns An object containing the validation errors, if any.
 */
export const validateTermsAceptance = (values: {
  personalDataCheck: boolean
  termsDataCheck: boolean
  acceptanceValueCheck: boolean
}) => {
  const errors: any = {}
  // Validate personalDataCheck
  if (!values.personalDataCheck) {
    errors.personalDataCheck = 'Debes aceptar el tratamiento de datos'
  }
  // Validate termsDataCheck
  if (!values.termsDataCheck) {
    errors.termsDataCheck = 'Debes aceptar los términos y condiciones'
  }
  // Validate acceptanceValueCheck
  if (!values.acceptanceValueCheck) {
    errors.acceptanceValueCheck = 'Debes aceptar el valor a solicitar'
  }
  return errors
}

/**
 * Validates the credit form values.
 * @param values - The values to be validated.
 * @returns An object containing the validation errors, if any.
 */
export const validateCreditForms = (
  values: {
    firstNamePersonalInfo: string
    middleNamePersonalInfo: string
    lastNamePersonalInfo: string
    secondLastNamePersonalInfo: string
    phonePersonalInfo: string
    emailPersonalInfo: string
    birthDatePersonalInfo: string
    typeDocument: string
    documentNumber: string
    ecoActivityWorkInfo: string
    nameCompanyWorkInfo: string
    telCompanyWorkInfo: string
    addressCompanyWorkInfo: string
    jobTitleWorkInfo: string
    contractKindWorkInfo: string
    initialWorkDateWorkInfo: string
    monthIngressFinancialInfo: string
    monthEgressFinancialInfo: string
    creditExperienceFinancialInfo: string
    disbursementFinancialInfo: string
    completeNameReference: string
    relationshipReference: string
    departmentReference: string
    municipalityReference: string
    phoneReference: string
    personalDataCheck: boolean
    termsDataCheck: boolean
    acceptanceValueCheck: boolean
  },
  signed?: boolean
) => {
  let errorsPersonalData: any = {}
  if (!signed) {
    errorsPersonalData = validatePersonaData(values)
  }
  const errorsJobData = validateJobInfo(values)
  const errorsFinancial = validateFinancialData(values)
  const errorsReference = validateReferenceData(values)
  const errorsTerms = validateTermsAceptance(values)

  if (Object.keys(errorsPersonalData).length > 0) {
    window.document
      .getElementById('firstTitle')
      ?.scrollIntoView({ behavior: 'smooth' })
    return {
      ...errorsPersonalData,
      ...errorsJobData,
      ...errorsFinancial,
      ...errorsReference,
      ...errorsTerms,
    }
  }

  if (Object.keys(errorsJobData).length > 0) {
    window.document
      .getElementById('personalInfo')
      ?.scrollIntoView({ behavior: 'smooth' })
    return {
      ...errorsPersonalData,
      ...errorsJobData,
      ...errorsFinancial,
      ...errorsReference,
      ...errorsTerms,
    }
  }
  if (Object.keys(errorsFinancial).length > 0) {
    window.document
      .getElementById('workInfo')
      ?.scrollIntoView({ behavior: 'smooth' })
    return {
      ...errorsPersonalData,
      ...errorsJobData,
      ...errorsFinancial,
      ...errorsReference,
      ...errorsTerms,
    }
  }
  if (Object.keys(errorsReference).length > 0) {
    window.document
      .getElementById('financialInfo')
      ?.scrollIntoView({ behavior: 'smooth' })
    return {
      ...errorsPersonalData,
      ...errorsJobData,
      ...errorsFinancial,
      ...errorsReference,
      ...errorsTerms,
    }
  }

  return {
    ...errorsPersonalData,
    ...errorsJobData,
    ...errorsFinancial,
    ...errorsReference,
    ...errorsTerms,
  }
}

/**
 * Validates the employment data.
 * @param values An object containing the employment data to be validated.
 * @returns An object containing the validation errors, if any.
 */
export const validateEmployData = (
  values: {
    completeName: string
    email: string
    asignPassword: string
    role: string
    identificationNumber: string
    commission: string
  },
  isCreating: boolean
) => {
  const errors: any = {}
  const contieneCaracterEspecial = values.asignPassword.match(
    /[~`!@#$%^&*()_+={}|\[\];:",.<>/?]/
  )
  // Validate name
  if (!ALPHA_REGEX.test(values.completeName)) {
    errors.completeName = 'Ingresa solo letras'
  }
  if (values.completeName.trim().length < 3) {
    errors.completeName = 'Este campo es obligatorio'
  }
  if (values?.completeName?.split(' ').length > 1) {
    if (values?.completeName?.split(' ')[1].length < 3) {
      errors.completeName = 'Por favor ingrese su nombre completo y apellidos'
    }
  } else {
    errors.completeName = 'Por favor ingrese su nombre completo y apellidos'
  }
  if (values.completeName.match(/[~`!@#$%^&*()_+={}|\[\];:",.<>/?]/)) {
    errors.completeName = 'Evite utilizar símbolos especiales en el nombre'
  }
  if (values.completeName.includes('  ')) {
    errors.completeName = 'Evite utilizar demásiados espacios en blanco'
  }
  // Validate email
  if (!EMAIL_REGEX.test(values.email)) {
    errors.email = 'Debe ingresar un correo electrónico válido'
  }
  // Validate role
  if (
    values.role === '-- Seleccione una opción --' ||
    values.role === '' ||
    !values.role
  ) {
    errors.role = 'Este campo es obligatorio'
  }
  // Validate asignPassword on Edit
  if (!isCreating && values.asignPassword === '*****') {
    return errors
  }
  // Validate identificationNumber
  if (values.role === 'approver') {
    if (!NUMBER_REGEX.test(values.identificationNumber)) {
      errors.identificationNumber = 'Ingresa solo valores númericos'
    }
    if (
      values.identificationNumber.length > 10 ||
      values.identificationNumber.length < 1
    ) {
      errors.identificationNumber = 'Ingrese un número de documento válido'
    }
  }
  // Validate commision
  if (values.role === 'approver') {
    if (values.commission.length < 1) {
      errors.commission = 'Ingresa un valor de comisión válido'
    }
  }
  // Validate asignPassword
  if (values.asignPassword.length < 8) {
    errors.asignPassword = 'Su contraseña debe tener al menos 8 caracteres'
    return errors
  }
  if (!/[a-z]/.test(values.asignPassword)) {
    errors.asignPassword = 'Su contraseña debe tener al menos una minúscula'
    return errors
  }
  const contieneMayúscula = values.asignPassword.match(/[A-Z]/)
  if (!contieneMayúscula) {
    errors.asignPassword = 'Su contraseña debe tener al menos una mayúscula'
    return errors
  }
  const contieneNúmero = values.asignPassword.match(/[0-9]/)
  if (!contieneNúmero) {
    errors.asignPassword = 'Su contraseña debe tener al menos un número'
    return errors
  }
  if (!contieneCaracterEspecial) {
    errors.asignPassword =
      'Su contraseña debe tener al menos un carácter especial'
    return errors
  }
  if (WHITESPACE_REGEX.test(values.asignPassword)) {
    errors.asignPassword = 'Evite colocar espacios en blanco en su contraseña'
    return errors
  }
  if (values.asignPassword.length > 50) {
    errors.asignPassword = 'Evite colocar más de 50 caracteres en su contraseña'
    return errors
  }
  return errors
}

/**
 * Validates the taxes form.
 * @param values An object containing the taxes data to be validated.
 * @returns An object containing the validation errors, if any.
 */
export const validateTaxForm = (values: {
  minAmount: number
  maxAmount: number
  eaPercentage: number
  emPercentage: number
  ivaPercentage: number
  interestPercentage: number
  insurancePercentage: number
  administrationPercentage: number
}) => {
  const errors: any = {}
  // Validate minAmount
  if (values.minAmount.toString().length < 1) {
    errors.minAmount = 'Este campo es obligatorio'
  }
  if (values.minAmount > 999999999 || values.minAmount.toString().length > 9) {
    errors.minAmount = 'No coloques más de 9 dígitos en este campo'
  }
  if (values.minAmount <= 0.000001) {
    errors.minAmount =
      'No puedes ingresar número negativos ni muy cercanos a cero'
  }
  if (values.minAmount >= values.maxAmount) {
    errors.minAmount =
      'No puedes ingresar un número mayor o igual al rango máximo'
  }
  // Validate maxAmount
  if (values.maxAmount.toString().length < 1) {
    errors.maxAmount = 'Este campo es obligatorio'
  }
  if (values.maxAmount > 999999999 || values.maxAmount.toString().length > 9) {
    errors.maxAmount = 'No coloques más de 9 dígitos en este campo'
  }
  if (values.maxAmount <= 0.000001) {
    errors.maxAmount =
      'No puedes ingresar número negativos ni muy cercanos a cero'
  }
  if (values.maxAmount <= values.minAmount) {
    errors.maxAmount =
      'No puedes ingresar un número menor o igual al rango mínimo'
  }
  // Validate eaPercentage
  if (values.eaPercentage.toString().length < 1) {
    errors.eaPercentage = 'Este campo es obligatorio'
  }
  if (
    values.eaPercentage > 999999999 ||
    values.eaPercentage.toString().length > 9
  ) {
    errors.eaPercentage = 'No coloques más de 9 dígitos en este campo'
  }
  if (values.eaPercentage <= 0.000001) {
    errors.eaPercentage =
      'No puedes ingresar número negativos ni muy cercanos a cero'
  }
  // Validate emPercentage
  if (values.emPercentage.toString().length < 1) {
    errors.emPercentage = 'Este campo es obligatorio'
  }
  if (
    values.emPercentage > 999999999 ||
    values.emPercentage.toString().length > 9
  ) {
    errors.emPercentage = 'No coloques más de 9 dígitos en este campo'
  }
  if (values.emPercentage <= 0.000001) {
    errors.emPercentage =
      'No puedes ingresar número negativos ni muy cercanos a cero'
  }
  // Validate ivaPercentage
  if (values.ivaPercentage.toString().length < 1) {
    errors.ivaPercentage = 'Este campo es obligatorio'
  }
  if (
    values.ivaPercentage > 999999999 ||
    values.ivaPercentage.toString().length > 9
  ) {
    errors.ivaPercentage = 'No coloques más de 9 dígitos en este campo'
  }
  if (values.ivaPercentage <= 0.000001) {
    errors.ivaPercentage =
      'No puedes ingresar número negativos ni muy cercanos a cero'
  }
  // Validate interestPercentage
  if (values.interestPercentage.toString().length < 1) {
    errors.interestPercentage = 'Este campo es obligatorio'
  }
  if (
    values.interestPercentage > 999999999 ||
    values.interestPercentage.toString().length > 9
  ) {
    errors.interestPercentage = 'No coloques más de 9 dígitos en este campo'
  }
  if (values.interestPercentage <= 0.000001) {
    errors.interestPercentage =
      'No puedes ingresar número negativos ni muy cercanos a cero'
  }
  // Validate insurancePercentage
  if (values.insurancePercentage.toString().length < 1) {
    errors.insurancePercentage = 'Este campo es obligatorio'
  }
  if (
    values.insurancePercentage > 999999999 ||
    values.insurancePercentage.toString().length > 9
  ) {
    errors.insurancePercentage = 'No coloques más de 9 dígitos en este campo'
  }
  if (values.insurancePercentage <= 0.000001) {
    errors.insurancePercentage =
      'No puedes ingresar número negativos ni muy cercanos a cero'
  }
  // Validate administrationPercentage
  if (values.administrationPercentage.toString().length < 1) {
    errors.administrationPercentage = 'Este campo es obligatorio'
  }
  if (
    values.administrationPercentage > 999999999 ||
    values.administrationPercentage.toString().length > 9
  ) {
    errors.administrationPercentage =
      'No coloques más de 9 dígitos en este campo'
  }
  if (values.administrationPercentage <= 0.000001) {
    errors.administrationPercentage =
      'No puedes ingresar número negativos ni muy cercanos a cero'
  }
  return errors
}
/**
 * Validates the new password form.
 * @param values - An object containing the form values to be validated to change the password.
 * @returns - An object containing the validation errors, if any.
 */
export const validateNewPassword = (values: {
  actualPassword: string
  newPassword: string
  confirmNewPassword: string
}) => {
  const errors: any = {}
  // Validate equal passwords
  if (values.newPassword !== values.confirmNewPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
  }
  if (values.newPassword.length < 8) {
    errors.newPassword = 'Su contraseña debe tener al menos 8 caracteres'
    return errors
  }

  // Validate uppercase

  const contieneMayúscula = values.newPassword.match(/[A-Z]/)
  if (!contieneMayúscula) {
    errors.newPassword = 'Su contraseña debe tener al menos una mayúscula'
    return errors
  }

  // Validate lowercase

  if (!/[a-z]/.test(values.newPassword)) {
    errors.newPassword = 'Su contraseña debe tener al menos una minúscula'
    return errors
  }

  // Validate number

  const contieneNúmero = values.newPassword.match(/[0-9]/)
  if (!contieneNúmero) {
    errors.newPassword = 'Su contraseña debe tener al menos un número'
    return errors
  }

  // Validate special character

  const contieneCaracterEspecial = values.newPassword.match(
    /[~`!@#$%^&*()_+={}|\[\];:",.<>/?]/
  )
  if (!contieneCaracterEspecial) {
    errors.newPassword =
      'Su contraseña debe tener al menos un carácter especial'
    return errors
  }
  if (WHITESPACE_REGEX.test(values.newPassword)) {
    errors.newPassword = 'Evite colocar espacios en blanco en su contraseña'
    return errors
  }
  if (values.newPassword.length > 50) {
    errors.newPassword = 'Evite colocar más de 50 caracteres en su contraseña'
    return errors
  }
  return errors
}

export const validateCheckCredit = (values: {
  documentNumber: string
  documentType: string
}) => {
  const errors: any = {}
  // Validate documentNumber
  if (!NUMBER_REGEX.test(values.documentNumber)) {
    errors.documentNumber = 'Ingresa solo valores númericos'
  }
  if (values.documentNumber.length > 10 || values.documentNumber.length < 5) {
    errors.documentNumber = 'Ingrese un número de documento válido'
  }
  return errors
}
