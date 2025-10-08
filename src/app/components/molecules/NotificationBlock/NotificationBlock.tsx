interface NotificationBlockProps {
  title: string
  read: boolean
  onClickHandler?: () => void
}

const NotificationBlock = ({
  title,
  read,
  onClickHandler,
}: NotificationBlockProps) => {
  return (
    <div className='flex flex-row justify-between items-center min-h-[45px] pl-4 pr-10 py-2 border-b-[1px] border-black text-black'>
      <p>{title}</p>
      {title && !read && (
        <span className='icon-notification text-error-color m-auto cursor-pointer' />
      )}
    </div>
  )
}

export default NotificationBlock
