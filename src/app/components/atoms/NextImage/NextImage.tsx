import Image from 'next/image'

interface Props {
  src: string
  width: number
  height?: number
  alt: string
  className?: string
  priority?: boolean
  onClickHandler?: () => void
}

/**
 * NextImage is a component that renders a next image
 * @param {string} src - The src of the image
 * @param {number} width - The width of the image
 * @param {number} height - The height of the image
 * @param {string} alt - The alt of the image
 * @param {string} className - The className of the image if needs custom styles
 * @param {boolean} priority - The priority of the image in the page load
 * @param {any} onClickHandler - The function to handle the click of the image
 * @example <NextImage src={src} width={width} height={height} alt={alt} className={className} priority={priority} onClickHandler={onClickHandler} />
 * @returns The NextImage component
 */
const NextImage = ({ src, width, height, alt, className, priority, onClickHandler }: Props) => {
  return (
    <Image
      className={className}
      src={src}
      width={width}
      height={height ?? 0}
      alt={alt}
      onClick={onClickHandler}
      priority={priority}
    />
  )
}

export default NextImage
