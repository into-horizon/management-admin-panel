import React, { useEffect, useState, forwardRef, ChangeEvent, Ref } from 'react'
import colors from '../services/colors'
import { CFormSelect } from '@coreui/react'
import { useTranslation } from 'react-i18next'

type PropTypes = {
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void
  value?: string
  selectStatement?: boolean
}

const ColorSelector = (props: PropTypes, ref: React.Ref<HTMLSelectElement> | undefined) => {
  const { t } = useTranslation('translation', { keyPrefix: 'colors' })
  const [color, setColor] = useState<string>('')
  let props2 = { ...props }
  delete props2.onChange
  delete props2.selectStatement
  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setColor(e.target.value)
    props.onChange?.(e)
  }

  useEffect(() => setColor(props.value ?? ''), [props.value])
  const secondaryColors = ['Black', 'Blue', 'Maroon', 'Navy']
  return (
    <CFormSelect
      style={{ backgroundColor: color, color: secondaryColors.includes(color) ? 'White' : 'Black' }}
      onChange={onChange}
      ref={ref}
      {...props2}
    >
      {props.selectStatement && (
        <option value='' disabled>
          select color
        </option>
      )}
      {colors.map((color, i) => (
        <option
          value={color}
          style={{
            backgroundColor: color,
            color: secondaryColors.includes(color) ? 'White' : 'Black',
          }}
          key={`${i}color`}
        >
          {t(color)}
        </option>
      ))}
    </CFormSelect>
  )
}

export default forwardRef(ColorSelector)
