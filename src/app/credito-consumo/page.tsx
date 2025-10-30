'use client'
import { SessionProvider } from 'next-auth/react'
import Footer from '../components/molecules/Footer/Footer'
import Header from '../components/molecules/Header/Header'
import BenefitsBanner from '../components/organisms/BenefitsBanner/BenefitsBanner'
import CheckState from '../components/organisms/CheckState/CheckState'
import FaqBanner from '../components/organisms/FaqBanner/FaqBanner'
import ForWhoBanner from '../components/organisms/ForWhoBanner/ForWhoBanner'
import GrowthBanner from '../components/organisms/GrowthBanner/GrowthBanner'
import MainBanner from '../components/organisms/MainBanner/MainBanner'
import StepsBanner from '../components/organisms/StepsBanner/StepsBanner'

export default function CreditoConsumo() {
  return (
    <>
      <SessionProvider>
        <Header />
      </SessionProvider>
      <main>
        <MainBanner />
        <CheckState />
        <BenefitsBanner />
        <GrowthBanner />
        <ForWhoBanner />
        <StepsBanner />
        <FaqBanner />
      </main>
      <Footer />
    </>
  )
}
