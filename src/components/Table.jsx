import React, { useState, useEffect, Children } from 'react'
import Paginator from './Paginator'
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormCheck, CSpinner } from '@coreui/react'


export const Table = ({ params, count, columns=[], data= [], changeData, cookieName, style, emptyMessage, checkbox,onSelect,updateParams, loading }) => {
    const [selected, setSelected] = useState([])
    const onChange = e =>{
        if(e.target.checked) {
            setSelected(x => [...x, e.target.value])
        } else {
            setSelected(x => x.filter(w=> w !== e.target.value))
        }
    }
    const selectAll = (e) => {
        if(e.target.checked){
            setSelected(data.map(s=>s.id))
        } else {
            setSelected([])
        }
    }
    useEffect(()=>{
        checkbox&& onSelect && onSelect(selected)
    },[selected])
    return (
        <>
        <div >

            <CTable style={style} striped>
                <CTableHead>
                    <CTableRow>
                    {checkbox&&<CTableDataCell><CFormCheck onChange={selectAll}/></CTableDataCell>}
                        {Children.toArray(columns.map(({ header }) =>
                            <CTableHeaderCell scope="col">{header}</CTableHeaderCell>
                        ))}
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {!loading && Children.toArray(data.map(d =>

                        <CTableRow>
                            {checkbox&&<CTableDataCell><CFormCheck value={d.id} onChange={onChange} checked={selected.includes(d.id)}/></CTableDataCell>}
                            {Children.toArray(columns.map(({ field, body: Body }) => {
                                return Body ? <CTableDataCell><Body {...d} /></CTableDataCell> : <CTableDataCell>{String(d[field]?? '-') }</CTableDataCell>
                            }))}
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
            {loading? <CSpinner color='primary'/>:  data.length === 0 ? <span  >{emptyMessage ?? `there's no data`}</span> :
                <Paginator params={params} count={count} changeData={changeData} cookieName={cookieName} updateParams={updateParams}/>
            }
        </div>

        </>
    )
}

 export default (Table)