import React, { useState, useEffect, Children, ReactPropTypes } from 'react'
import Paginator from './Paginator'
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormCheck, CSpinner, CRow, CCol, CFormSelect, CFormLabel } from '@coreui/react'
import _ from 'lodash'
import PropTypes from 'prop-types'


export const Table = ({ updateLoading, params, count, columns = [], data = [], changeData, cookieName, style, emptyMessage, checkbox, onSelect, updateParams, loading, displayedItems, pagination = true }) => {
    const [selected, setSelected] = useState([])
    const onChange = e => {
        if (e.target.checked) {
            setSelected(x => [...x, e.target.value])
        } else {
            setSelected(x => x.filter(w => w !== e.target.value))
        }
    }
    const selectAll = (e) => {
        if (e.target.checked) {
            setSelected(data.map(s => s.id))
        } else {
            setSelected([])
        }
    }
    let displayItems = _.range(5, 100, 5)
    useEffect(() => {
        checkbox && onSelect?.(selected)
    }, [selected])

    const changeHandler = e =>{
        updateParams?.  (x=> {
            changeData({...x, limit: Number(e.target.value)})
            return {...x, limit: Number(e.target.value)}
        })
       
    }
    return (
        <>
            <div className='overflow-x'>

                <CTable style={style} striped>
                    <CTableHead>
                        <CTableRow>
                            {checkbox && <CTableDataCell><CFormCheck onChange={selectAll} /></CTableDataCell>}
                            {Children.toArray(columns.map(({ header }) =>
                                <CTableHeaderCell scope="col">{header}</CTableHeaderCell>
                            ))}
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {!loading && Children.toArray(data.map(d =>

                            <CTableRow>
                                {checkbox && <CTableDataCell><CFormCheck value={d.id} onChange={onChange} checked={selected.includes(d.id)} /></CTableDataCell>}
                                {Children.toArray(columns.map(({ field, body: Body }) => {
                                    return Body ? <CTableDataCell><Body {...d} /></CTableDataCell> : <CTableDataCell>{String(d[field] ?? '-')}</CTableDataCell>
                                }))}
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
                {pagination && (loading ? <CSpinner color='primary' /> : data.length === 0 ? <span  >{emptyMessage ?? `there's no data`}</span> :
                    <CRow className='justify-content-between align-items-end'   >
                        <CCol xs='auto'>

                            <Paginator params={params} count={count} changeData={changeData} cookieName={cookieName} updateParams={updateParams} updateLoading={updateLoading} />
                        </CCol>
                        {displayedItems && <CCol xs='auto'>
                            <CRow className='align-items-center'>
                                <CCol xs='auto' >
                            <CFormLabel name='display'>
                                Displayed Items
                            </CFormLabel>

                                </CCol>
                                <CCol xs='auto'>
                            <CFormSelect name='display' onChange={changeHandler} value={params.limit}>
                                {
                                    Children.toArray(
                                        displayItems.map(val => <option value={val}>{val}</option>)
                                    )
                                }
                            </CFormSelect>

                                </CCol>
                            </CRow>
                        </CCol>}

                    </CRow>)
                }
            </div>

        </>
    )
}

Table.propTypes ={
    updateLoading : PropTypes.func,
    params: PropTypes.object,
    changeData: PropTypes.func,
    cookieName: PropTypes.string,
    updateParams: PropTypes.func,
    displayedItems: PropTypes.bool,
    columns: PropTypes.arrayOf(PropTypes.shape({
        header: PropTypes.string.isRequired,
        field: PropTypes.string,
        body: PropTypes.elementType
    })).isRequired,
    data: PropTypes.array.isRequired,
    count: PropTypes.number,
    emptyMessage: PropTypes.string,
    pagination: PropTypes.bool,
    checkbox: PropTypes.bool,
    onSelect: PropTypes.func,
}

export default (Table)