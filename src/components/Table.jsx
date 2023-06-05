import React, { useState, useEffect, Children, ReactPropTypes } from 'react'
import Paginator from './Paginator'
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormCheck, CSpinner, CRow, CCol, CFormSelect, CFormLabel, CButton, CTooltip, CFormInput } from '@coreui/react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import { cilCheck, cilPen, cilX } from '@coreui/icons'
import TableEditCell from './TableEditCell'


export const Table = ({ updateLoading, params, count, columns = [], data = [], changeData, cookieName, style, emptyMessage, checkbox, onSelect, updateParams, loading, displayedItems, pagination = true, editable, editFn, Actions }) => {
    const [selected, setSelected] = useState([])
    const [onEdit, setOnEdit] = useState('')
    const [item, setItem] = useState({})
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

    const changeHandler = e => {
        updateParams?.(x => {
            changeData({ ...x, limit: Number(e.target.value) })
            return { ...x, limit: Number(e.target.value) }
        })

    }

    const updateItem = e => {
        setItem(x => { return { ...x, [e.target.id]: e.target.value } })
    }
    const editClick = () => {
        Promise.all([editFn(item)]).then(() => setOnEdit(''))
    }

    const CloneActions = ({ data, children }) => {
        return (
            React.cloneElement(children, data)
        )
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
                            <CTableHeaderCell>Actions</CTableHeaderCell>
                        </CTableRow>

                    </CTableHead>
                    <CTableBody>
                        {!loading && Children.toArray(data.map((d, i) =>
                            <CTableRow>
                                {checkbox && <CTableDataCell><CFormCheck value={d.id} onChange={onChange} checked={selected.includes(d.id)} /></CTableDataCell>}
                                {Children.toArray(columns.map(({ field, body: Body, edit }) => {
                                    if (i === onEdit) {
                                        return <CTableDataCell>
                                            {edit && edit.inputType ? <TableEditCell type={edit.inputType} id={field} onChange={updateItem} value={item[field]} options={edit.options} /> : <CFormInput type='text' disabled value={item[field]} />}
                                        </CTableDataCell>
                                    }
                                    return Body ? <CTableDataCell><Body {...d} /></CTableDataCell> : <CTableDataCell>{String(d[field] ?? '-')}</CTableDataCell>
                                }))}
                                {editable && <CTableDataCell>
                                    {(i === onEdit) ? <>
                                        <CTooltip content='confirm'>
                                            <CButton color='success' onClick={editClick}>
                                                <CIcon icon={cilCheck} />
                                            </CButton>
                                        </CTooltip>
                                        <CTooltip content='cancel' >
                                            <CButton color='danger' onClick={() => setOnEdit('')}>
                                                <CIcon icon={cilX} />
                                            </CButton>
                                        </CTooltip>

                                    </> :
                                        <>
                                            <CTooltip content='edit'>
                                                <CButton color='secondary' onClick={() => {
                                                    setOnEdit(i)
                                                    setItem(d)
                                                }}>
                                                    <CIcon icon={cilPen} />
                                                </CButton>
                                            </CTooltip>
                                            {Actions && <Actions {...d} /> }
                                        </>}
                                </CTableDataCell>}
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

Table.propTypes = {
    updateLoading: PropTypes.func,
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
    editable: PropTypes.bool
}

export default (Table)