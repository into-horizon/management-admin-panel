import React, { FormEvent, useState } from 'react'
import { CButton, CCol, CForm, CFormInput, CFormLabel, CRow, CTooltip } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import Draggable from 'react-draggable'
import { cilFilterSquare, cilCursorMove, cilFilter, cilFilterX } from '@coreui/icons'
import SearchDropdown, { OptionType } from '../components/SearchDropdown'
import { searchForStore } from '../store/store'
import { populateStore } from '../store/filter'
import { RootState } from '../store'
import { StoreType } from '../types'
import { setDate as _setDate } from '../services/helpers'
import CIcon from '@coreui/icons-react'

export function DraggableFilter() {
  const [filterVisible, setVisibleFilter] = useState(false)
  const [selectedStore, setSelectedStore] = useState<OptionType | undefined | null>(null)
  const { searched } = useSelector((state: RootState) => state.stores)
  const { duration } = useSelector((state: RootState) => state.filter)
  const dispatch = useDispatch()
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const target = e.currentTarget
    dispatch(
      populateStore({
        store: selectedStore!,
        duration: `${target.from.value}&${target.to.value}`,
      }),
    )
  }
  const resetHandler = (e: FormEvent<HTMLFormElement>) => {
    const target = e.currentTarget
    target.reset()
    dispatch(populateStore())
  }
  return (
    <Draggable handle='strong' axis='y'>
      <div className='filter'>
        <CRow
          className='justify-content-center'
          xs={{
            gutterY: 3,
          }}
        >
          <CCol xs={12}>
            <CTooltip content='move'>
              <strong
                style={{
                  margin: 'auto',
                  textAlign: 'center',
                }}
                className='cursor move'
              >
                <div>
                  <CIcon
                    style={{
                      margin: 'auto',
                    }}
                    icon={cilCursorMove}
                    size='lg'
                  />
                </div>
              </strong>
            </CTooltip>
          </CCol>
          <CCol
            xs={12}
            style={{
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            <CTooltip content='select seller'>
              <CButton color='info' size='lg' onClick={() => setVisibleFilter((x) => !x)}>
                <CIcon icon={cilFilterSquare} size='xl' />
              </CButton>
            </CTooltip>
          </CCol>
          {filterVisible && (
            <CForm onSubmit={submitHandler} onReset={resetHandler}>
              <CRow
                className='justify-content-center'
                xs={{
                  gutterY: 3,
                }}
              >
                <CCol xs={10}>
                  <SearchDropdown
                    options={searched.map((store: StoreType) => {
                      return {
                        id: store.id,
                        title: store.store_name,
                      }
                    })}
                    placeholder='search for store by store name, email or mobile number'
                    selectedValue={selectedStore}
                    onChange={(e) =>
                      dispatch(
                        searchForStore({
                          query: e,
                        }),
                      )
                    }
                    onSelect={(e) => setSelectedStore(e)}
                    loading={false}
                  />
                </CCol>
                <CRow className='justify-content-center'>
                  <CCol xs='auto'>
                    <CFormLabel htmlFor='from'>from</CFormLabel>
                    <CFormInput
                      name='from'
                      type='date'
                      defaultValue={duration?.split('&')[0]}
                      max={_setDate()}
                    />
                  </CCol>
                  <CCol xs='auto'>
                    <CFormLabel htmlFor='to'>to</CFormLabel>
                    <CFormInput
                      name='to'
                      type='date'
                      defaultValue={duration?.split('&')[1]}
                      max={_setDate()}
                    />
                  </CCol>
                </CRow>
                <CCol xs='auto'>
                  <CTooltip content='apply filter'>
                    <CButton type='submit'>
                      <CIcon icon={cilFilter} />
                    </CButton>
                  </CTooltip>
                </CCol>
                <CCol xs='auto'>
                  <CTooltip content='clear filter'>
                    <CButton color='secondary' type='reset'>
                      <CIcon icon={cilFilterX} />
                    </CButton>
                  </CTooltip>
                </CCol>
              </CRow>
            </CForm>
          )}
        </CRow>
      </div>
    </Draggable>
  )
}
