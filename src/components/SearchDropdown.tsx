import React, {
  useState,
  useEffect,
  Children,
  ChangeEvent,
  Dispatch,
  useRef,
  FC,
} from 'react'
import {
  CCloseButton,
  CFormCheck,
  CFormInput,
  CListGroup,
  CListGroupItem,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilChevronBottom } from '@coreui/icons'
export type OptionType<T = string, P = string> = { title: T; id: P } & Record<
  string,
  any
>

type PropTypes = {
  options: OptionType[]
  onChange: (d: string) => void
  loading: boolean
  placeholder?: string
  delay?: number
  emptyMessage?: string
} & (
  | {
      multiple: true
      selectedValue?: OptionType[]
      onSelect: (d: OptionType[]) => void
    }
  | {
      multiple?: false | undefined
      selectedValue?: OptionType | null
      onSelect: (d: OptionType | null) => void
    }
)
const SearchDropdown: FC<PropTypes> = ({
  options,
  onSelect,
  onChange,
  loading,
  placeholder,
  delay,
  multiple,
  selectedValue,
  emptyMessage,
}) => {
  const [isListOpen, setIsListOpen] = useState(false)
  const [value, setValue] = useState<string | null | number>(null)

  const containerRef = useRef<HTMLDivElement | null>(null)

  const onSelectValue = (e: OptionType) => {
    if (multiple) {
      if (selectedValue) {
        onSelect(selectedValue?.concat(e))
      } else {
        onSelect([e])
      }
    } else {
      onSelect(e as OptionType)
    }
  }
  const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setIsListOpen(true)
    setValue(e.target.value)
    onChange?.(e.target.value)
  }

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
  function getSelected(
    option: OptionType<string, string>
  ): boolean | undefined {
    if (Array.isArray(selectedValue)) {
      return !!selectedValue.find((item) => item.id === option.id)
    }
  }

  return (
    <div className='search-dropdown form-control' ref={containerRef}>
      <div className='end-adornment'>
        {loading ? (
          <CSpinner color='secondary' size='sm' />
        ) : (
          <>
            {!multiple && selectedValue && (
              <CCloseButton
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect(null)
                  console.log('clicked')
                  setValue(null)
                }}
              />
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
                <strong>{item.title}</strong>
                <CCloseButton
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelect(selectedValue.filter((i) => i.id !== item.id))
                  }}
                />
              </span>
            ))
          ) : (
            <span>{selectedValue?.title}</span>
          )}
        </div>
      )}
      {((!multiple && !selectedValue) || multiple) && (
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
                    className='floating-dropdown-item position-relative'
                    type='button'
                    onClick={(e) => {
                      if (multiple) {
                        e.stopPropagation()
                      }
                      !multiple && onSelectValue(option)
                    }}
                  >
                    {multiple ? (
                      <CFormCheck
                        id={option.title}
                        label={option.title}
                        floatingLabel={option.title}
                        checked={getSelected(option)}
                        className=' position-absolute'
                        hitArea='full'
                        onChange={(e) =>
                          e.target.checked
                            ? onSelectValue(option)
                            : onSelect(
                                (selectedValue as Array<OptionType>).filter(
                                  (i) => i.id !== option.id
                                )
                              )
                        }
                      />
                    ) : (
                      option.title
                    )}
                  </CListGroupItem>
                ))
              : value && !loading && (
                  <CListGroupItem
                    component='button'
                    className='floating-dropdown-item'
                    type='button'
                    disabled
                  >
                    {emptyMessage ?? ' no results found'}
                  </CListGroupItem>
                )
          )}
        </CListGroup>
      )}
    </div>
  )
}

export default SearchDropdown
