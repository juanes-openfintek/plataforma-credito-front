import LineTitle from '../../atoms/LineTitle/LineTitle'
import SimpleFieldInput from '../../atoms/SimpleFieldInput/SimpleFieldInput'

interface ThreeColumnInputsProps {
  fields: {
    value: string
    errors: string | undefined
    type: string
    options?: {
      text: string
      value: string
    }[]
    label: string
    readonly?: boolean
    placeholder?: string
    name: string
  }[]
  title?: string
  idTitle?: string
  border?: boolean
  headerAlternative?: boolean
  noLowerLine?: boolean
  onHandleChange?: any
}
/**
 * ThreeColumnInputs is a component that renders the three column inputs
 * @param {Array<{value: string, errors: string | undefined, type: string, label: string, placeholder?: string, name: string}>} fields - The fields of the inputs
 * @param {string} title - The title of the component
 * @param {string} idTitle - The idTitle of the component
 * @param {boolean} border - The border of the component
 * @param {boolean} headerAlternative - The headerAlternative of the component
 * @param {boolean} noLowerLine - The lowerLine of the component
 * @param {any} onHandleChange - The onHandleChange function
 * @example <ThreeColumnInputs fields={fields} title={title} border={border} headerAlternative={headerAlternative} onHandleChange={onHandleChange} />
 * @returns The ThreeColumnInputs component
 */
const ThreeColumnInputs = ({
  fields,
  title,
  idTitle,
  border,
  headerAlternative,
  noLowerLine,
  onHandleChange,
}: ThreeColumnInputsProps) => {
  return (
    <div
      className={`${
        noLowerLine ? '' : 'border-b-[1px] border-black'
      } py-12`}
    >
      {title && (
        <LineTitle
          title={title}
          idTitle={idTitle}
          headerAlternative={headerAlternative}
        />
      )}
      <div className={`${headerAlternative ? 'max-md:mx-0 mx-20' : ''} grid grid-cols-3 max-lg:grid-cols-1 gap-4 max-lg:gap-2 max-lg:py-6`}>
        {fields.map((field, index) => (
          <SimpleFieldInput
            key={`${field.name}-${index}}`}
            value={field.value}
            errors={field.errors}
            type={field.type}
            options={field.options}
            border={border}
            readonly={field.readonly}
            placeholder={field.placeholder}
            label={field.label}
            name={field.name}
            onHandleChange={onHandleChange}
          />
        ))}
      </div>
    </div>
  )
}

export default ThreeColumnInputs
