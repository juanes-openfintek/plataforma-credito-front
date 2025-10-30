import NextImage from '../../atoms/NextImage/NextImage'
/**
 * Footer is a component that renders the footer
 * @example <Footer />
 * @returns The Footer component
 */
const Footer = () => {
  return (
    <footer id="contactanos" className='bg-gradient-to-br from-primary-color to-accent-color text-white'>
      <div className='max-w-7xl mx-auto px-4 lg:px-20 py-16 lg:py-20'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12'>
          <div className='flex flex-col space-y-6'>
            <NextImage
              src='/images/openfintek-logo.png'
              alt='OpenFintek logo'
              className='w-40 h-auto filter brightness-0 invert object-contain max-h-12'
              width={160}
              height={40}
            />
            <p className='text-white/80 text-sm leading-relaxed max-w-xs'>
              Creditos digitales rapidos, seguros y transparentes para impulsar negocios, colaboradores e independientes.
            </p>
          </div>

          <div className='flex flex-col space-y-4'>
            <h3 className='text-xl font-bold mb-2'>Enlaces rapidos</h3>
            <a href='/#creditos' className='text-white/80 hover:text-white transition-colors py-2 hover:translate-x-2 transform duration-200'>
              {'->'} Creditos
            </a>
            <a href='/#beneficios' className='text-white/80 hover:text-white transition-colors py-2 hover:translate-x-2 transform duration-200'>
              {'->'} Beneficios
            </a>
            <a href='/#nosotros' className='text-white/80 hover:text-white transition-colors py-2 hover:translate-x-2 transform duration-200'>
              {'->'} Nosotros
            </a>
            <a href='/#preguntas' className='text-white/80 hover:text-white transition-colors py-2 hover:translate-x-2 transform duration-200'>
              {'->'} Preguntas frecuentes
            </a>
          </div>

          <div className='flex flex-col space-y-4'>
            <h3 className='text-xl font-bold mb-2'>Siguenos</h3>
            <p className='text-white/80 text-sm mb-4'>Mantente conectado con nuestras novedades de credito digital.</p>
            <div className='flex gap-4'>
              <a href='#' className='w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all hover:scale-110' aria-label='Instagram'>
                <span className='icon-instagram text-xl' />
              </a>
              <a href='#' className='w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all hover:scale-110' aria-label='Facebook'>
                <span className='icon-facebook text-xl' />
              </a>
              <a href='#' className='w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all hover:scale-110' aria-label='LinkedIn'>
                <NextImage
                  src='/images/linkedin-icon.png'
                  alt='LinkedIn'
                  width={20}
                  height={20}
                  className='filter brightness-0 invert'
                />
              </a>
              <a href='#' className='w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all hover:scale-110' aria-label='YouTube'>
                <span className='icon-youtube text-xl' />
              </a>
            </div>
          </div>
        </div>

        <div className='border-t border-white/20 mt-12 pt-8 text-center'>
          <p className='text-white/60 text-sm'>
            (c) {new Date().getFullYear()} OpenFintek. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
