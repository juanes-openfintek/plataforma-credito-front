interface SimpleFieldInputProps {
  value: string
  errors?: string | undefined
  type: string
  options?: {
    text: string,
    value: string
  }[]
  placeholder?: string
  label: string
  name?: string
  border?: boolean
  readonly?: boolean
  alternativeText?: boolean,
  onHandleChange?: any
}

/**
 * SimpleFieldInput is a component that renders a simple input field with his label and errors
 * @param {string} value - The value of the input field
 * @param {string} errors - The errors of the input field
 * @param {string} type - The type of the input field
 * @param {string} placeholder - The placeholder of the input field
 * @param {string} label - The label of the input field
 * @param {string} name - The name of the input field
 * @param {boolean} border - Allow the border of the input field
 * @param {boolean} readonly - Allow the readonly of the input field
 * @param {any} onHandleChange - The function to handle the change of the input field
 * @example <SimpleFieldInput value={value} errors={errors} type={type} placeholder={placeholder} label={label} name={name} border={border} readonly={readonly} onHandleChange={onHandleChange} />
 * @returns The SimpleFieldInput component
 */
const SimpleFieldInput = ({
  value,
  errors,
  label,
  type,
  options,
  placeholder = '',
  name,
  border,
  readonly,
  alternativeText,
  onHandleChange,
}: SimpleFieldInputProps) => {
  return (
    <div className={`w-full ${alternativeText ? 'text-primary-color font-bold' : 'text-black'} font-poppins text-[18px]`}>
      <label htmlFor={name} className='font-semibold text-black'>
        {label}
      </label>
      {type === 'select' ? (
        <select
          className={`bg-white w-full rounded-md py-2 px-2 my-1 ${
            border ? 'border-[1px] border-black' : ''
          }`}
          id={name}
          value={value}
          name={name}
          disabled={readonly}
          onChange={onHandleChange}
        >
          {options?.map((option, index) => (
            <option key={`${option}-${index}`} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          className={`bg-white w-full rounded-md py-2 px-2 my-1 ${
            border ? 'border-[1px] border-black' : ''
          }`}
          id={name}
          name={name}
          placeholder={placeholder}
          onChange={onHandleChange}
          value={value}
          disabled={readonly}
        />
      ) : type === 'date' ? (
        <div className='relative'>
          <input
            className={`bg-white w-full rounded-md py-[0.4rem] px-2 my-1 input-container ${
              border ? 'border-[1px] border-black' : ''
            } ${value ? '' : 'text-transparent'}`}
            id={name}
            name={name}
            type='date'
            max={new Date().toISOString().split('T')[0]}
            placeholder={placeholder}
            onChange={onHandleChange}
            value={value}
            disabled={readonly}
          />
          {!value && (
            <div className='flex flex-row items-center absolute left-6 top-1/4 pointer-events-none'>
              <span className='icon-calendar p-[1px]' />
              <p className='ml-2 pt-[2px] text-light-color-two'>{placeholder}</p>
            </div>
          )}
        </div>
      ) : (
        <input
          className={`bg-white w-full rounded-md py-2 px-2 my-1 ${
            border ? 'border-[1px] border-black' : ''
          }`}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          onChange={onHandleChange}
          value={value}
          disabled={readonly}
        />
      )}

      {errors ? <div className='text-error-color mb-6'>{errors}</div> : null}
    </div>
  )
}

export default SimpleFieldInput
