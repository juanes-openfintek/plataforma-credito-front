import TagStatus from '../../atoms/TagStatus/TagStatus'

interface StateTagProps {
  state: string
}

const StateTag = ({ state }: StateTagProps) => {
  return (
    <div className='flex flex-row justify-start items-center gap-4 text-black font-semibold font-poppins my-14'>
      <p>Estado: </p>
      <TagStatus text={state} />
    </div>
  )
}

export default StateTag
