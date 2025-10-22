'use client'
import ExpandableItem from '../../molecules/ExpandableItem/ExpandableItem'
import { Faqs } from '../../../constants/FaqData'

/**
 * FaqBanner component
 * @example <FaqBanner />
 * @returns The FaqBanner component
 */
const FaqBanner = () => {
  return (
    <section id="preguntas" className='bg-white text-black p-[10rem] max-lg:p-6'>
      <h2 className='max-2xl:text-4xl text-[3.75rem] text-center max-lg:mt-10 relative'>
        Preguntas{' '}
        <span className='text-primary-color font-bold'>Frecuentes</span>
      </h2>
      <div className='flex flex-col mt-12'>
        {Faqs.map((faq, index) => (
          <div
            className={
              index === Faqs.length - 1
                ? ' py-4 text-sm'
                : 'border-b-3 py-4 text-sm'
            }
            key={`card-${index}`}
          >
            <ExpandableItem question={faq.question} answer={faq.answer} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default FaqBanner
