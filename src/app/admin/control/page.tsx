import WelcomeMessage from '../../components/atoms/WelcomeMessage/WelcomeMessage'
import AdminEmploySection from '../../components/organisms/AdminEmploySection/AdminEmploySection'

const ControlPage = () => {
  return (
    <main>
      <section className='p-[1rem] xl:ml-[300px] xl:mr-[50px] max-lg:pt-14 text-primary-color'>
        <WelcomeMessage />
        <AdminEmploySection />
      </section>
    </main>
  )
}

export default ControlPage
