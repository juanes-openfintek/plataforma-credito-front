import type { Meta, StoryObj } from '@storybook/react'

import AdminDataCreditBlock from './AdminDataCreditBlock'

const meta = {
  title: 'Components/Molecules/AdminDataCreditBlock',
  component: AdminDataCreditBlock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AdminDataCreditBlock>

export default meta
type Story = StoryObj<typeof meta>

export const Field: Story = {
  args: {
    creditUserData: {
      _id: 'string',
      status: 'pending',
      code: 0,
      details: 'string',
      amount: 0,
      quotasNumber: 0,
      maxDate: 'string',
      email: 'string',
      created: 'string',
      updatedAt: 'string',
      typeContract: 'string',
      account: {
        _id: 'string',
        user: 'string',
        urlCertificate: 'string',
        accountNumber: 'string',
        accountType: 'string',
        lastNumbers: 'string',
        accountEntity: 'string',
        isActive: false,
        default: false,
        __v: 0,
        updatedAt: 'string',
      },
      arkdia: {
        _id: 'string',
        documentId: 'string',
        status: 'string',
      },
      user: {
        email: 'string',
        uid: 'string',
        isActive: true,
        roles: ['string'],
        emailVerified: true,
        documentNumber: 'string',
        documentType: 'string',
        dateOfBirth: 'string',
        name: 'string',
        secondName: 'string',
        lastname: 'string',
        secondLastname: 'string',
      },
      taxes: {
        minAmount: 0,
        maxAmount: 0,
        rateEffectiveAnnual: 0,
        rateEffectiveMonthly: 0,
        rateDefault: 0,
        rateInsurance: 0,
        rateAdministration: 0,
        iva: 0
      },
      name: '',
      secondName: '',
      lastname: '',
      secondLastname: '',
      phoneNumber: '',
      dateOfBirth: '',
      documentType: '',
      documentNumber: '',
      economicActivity: '',
      nameCompany: '',
      phoneNumberCompany: '',
      addressCompany: '',
      positionCompany: 'string',
      dateOfAdmission: 'string',
      monthlyIncome: 'string',
      monthlyExpenses: 'string',
      experienceCredit: 'string',
      disburserMethod: 'string',
      nameReferencePersonal: 'string',
      parentescoReferencePersonal: 'string',
      phoneNumberReferencePersonal: 'string',
      departamentReferencePersonal: 'string',
      municipalityReferencePersonal: 'string',
      commission: 'string',
      identificationNumber: 'string',
    },
  },
}
