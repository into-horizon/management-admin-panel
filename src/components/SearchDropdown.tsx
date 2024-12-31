import React, { useState, useEffect, Children, ChangeEvent, Dispatch, useRef } from 'react'
import { CButton, CFormInput, CListGroup, CListGroupItem, CSpinner } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilChevronBottom, cilX } from '@coreui/icons'
export type OptionType<T = string, P = string> = { title: T; id: P }

type PropTypes = {
  options: OptionType[]
  onSelect: (d: OptionType) => void
  onChange: (d: string) => void
  loading: boolean
  placeholder?: string
  delay?: number
  selectedValue?: {} | null
} & (
  | { reset: boolean; resetCallback: Dispatch<React.SetStateAction<boolean>> }
  | { reset?: undefined; resetCallback?: undefined }
) &
  (
    | { multiple: true; selectedValue?: OptionType[]; onSelect: (d: OptionType[]) => void }
    | {
        multiple?: false | undefined
        selectedValue?: OptionType | null
        onSelect: (d: OptionType | null) => void
      }
  )
const SearchDropdown = ({
  options,
  onSelect,
  onChange,
  loading,
  placeholder,
  reset,
  delay,
  multiple,
  selectedValue,
  ...props
}: PropTypes) => {
  const [isListOpen, setIsListOpen] = useState(false)
  const [value, setValue] = useState<string | null | number>(null)

  const containerRef = useRef<HTMLDivElement | null>(null)

  const onSelectValue = (e: OptionType) => {
    setValue(e.title)
    onSelect(e)
  }
  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setIsListOpen(true)
    setValue(e.target.value)
    onChange?.(e.target.value)
  }

  const resetValue = () => {
    setValue('')
  }
  useEffect(() => {
    if (reset) {
      resetValue()
      props.resetCallback?.(false)
    }
  }, [reset])

  useEffect(() => {
    const listVisibilityHandler = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) {
        setIsListOpen((visibility) => !visibility)
      } else {
        setIsListOpen(false)
      }
    }
    window.addEventListener('click', listVisibilityHandler)
    return () => {
      window.removeEventListener('click', listVisibilityHandler)
    }
  }, [])
  return (
    <div className='search-dropdown form-control' ref={containerRef}>
      <div className='end-adornment'>
        {loading ? (
          <CSpinner color='secondary' size='sm' />
        ) : (
          <>
            {!multiple && selectedValue && (
              <CButton size='sm' color='transparent' onClick={() => onSelect(null)}>
                <CIcon icon={cilX} size='sm' />
              </CButton>
            )}

            <CIcon icon={cilChevronBottom} color='red' size='sm' />
          </>
        )}
      </div>
      {selectedValue && (
        <div className='selected-items'>
          {multiple ? (
            selectedValue?.map((item) => (
              <span className='chip' key={item.id}>
                {item.title}
              </span>
            ))
          ) : (
            <span>{selectedValue?.title}</span>
          )}
        </div>
      )}
      {!multiple && !selectedValue && (
        <CFormInput
          className='dropdown-input'
          onChange={onChangeValue}
          placeholder={placeholder ?? 'search for title'}
          delay={delay}
        />
      )}

      {isListOpen && (
        <CListGroup className={'floating-dropdown'}>
          {Children.toArray(
            options.length !== 0
              ? options?.map((option) => (
                  <CListGroupItem
                    component='button'
                    className='floating-dropdown-item'
                    type='button'
                    onClick={() => onSelectValue(option)}
                  >
                    {option.title}
                  </CListGroupItem>
                ))
              : value && (
                  <CListGroupItem
                    component='button'
                    className='floating-dropdown-item'
                    type='button'
                    disabled
                  >
                    no results found
                  </CListGroupItem>
                ),
          )}
        </CListGroup>
      )}
    </div>
  )
}

export default SearchDropdown
