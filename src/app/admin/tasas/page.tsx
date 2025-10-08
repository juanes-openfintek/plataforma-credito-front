import WelcomeMessage from '../../components/atoms/WelcomeMessage/WelcomeMessage'
import AdminTaxesSection from '../../components/organisms/AdminTaxesSection/AdminTaxesSection'

const TaxesAdminPage = () => {
  return (
    <main>
      <section className='p-[1rem] xl:ml-[300px] xl:mr-[50px] max-lg:pt-14 text-primary-color'>
        <WelcomeMessage />
        <AdminTaxesSection />
      </section>
    </main>
  )
}

export default TaxesAdminPage
