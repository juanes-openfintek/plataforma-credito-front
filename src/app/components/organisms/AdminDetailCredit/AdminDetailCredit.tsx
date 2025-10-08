'use client'
import { CreditData } from '../../../interfaces/creditData.interface'
import BreadcrumbLabel from '../../atoms/BreadcrumbLabel/BreadcrumbLabel'
import AdminDataCreditBlock from '../../molecules/AdminDataCreditBlock/AdminDataCreditBlock'
import AdminDataExpandedCreditBlock from '../../molecules/AdminDataExpandedCreditBlock/AdminDataExpandedCreditBlock'
import AdminDetailCreditUserBlock from '../../molecules/AdminDetailCreditUserBlock/AdminDetailCreditUserBlock'
import AdminUserCreditBlock from '../../molecules/AdminUserCreditBlock/AdminUserCreditBlock'
import StateTag from '../../molecules/StateTag/StateTag'
import TaxInfoBlock from '../../molecules/TaxInfoBlock/TaxInfoBlock'

interface AdminDetailCreditProps {
  selectedCredit: CreditData
  setShowForm: (showForm: boolean) => void
}

const AdminDetailCredit = ({ setShowForm, selectedCredit }: AdminDetailCreditProps) => {
  return (
    <section>
      <BreadcrumbLabel alternative text='Créditos' leftArrow link='/admin' onClickHandler={() => setShowForm(false)} />
      <StateTag state={selectedCredit?.status} />
      <AdminDetailCreditUserBlock creditUserData={selectedCredit} />
      <AdminDataCreditBlock creditUserData={selectedCredit} />
      <TaxInfoBlock creditUserData={selectedCredit} />
      <AdminUserCreditBlock creditUserData={selectedCredit} />
      <AdminDataExpandedCreditBlock dataCredit={selectedCredit} title='Información del usuario' />
    </section>
  )
}

export default AdminDetailCredit
