'use client'
import { SessionProvider } from 'next-auth/react'
import Footer from '../components/molecules/Footer/Footer'
import Header from '../components/molecules/Header/Header'
import BenefitsBannerLibranza from '../components/organisms/BenefitsBannerLibranza/BenefitsBannerLibranza'
import CheckStateLibranza from '../components/organisms/CheckStateLibranza/CheckStateLibranza'
import FaqBanner from '../components/organisms/FaqBanner/FaqBanner'
import ForWhoBannerLibranza from '../components/organisms/ForWhoBannerLibranza/ForWhoBannerLibranza'
import GrowthBannerLibranza from '../components/organisms/GrowthBannerLibranza/GrowthBannerLibranza'
import MainBannerLibranza from '../components/organisms/MainBannerLibranza/MainBannerLibranza'
import StepsBannerLibranza from '../components/organisms/StepsBannerLibranza/StepsBannerLibranza'

export default function CreditoLibranza() {
  return (
    <>
      <SessionProvider>
        <Header />
      </SessionProvider>
      <main>
        <MainBannerLibranza />
        <CheckStateLibranza />
        <BenefitsBannerLibranza />
        <GrowthBannerLibranza />
        <ForWhoBannerLibranza />
        <StepsBannerLibranza />
        <FaqBanner />
      </main>
      <Footer />
    </>
  )
}
