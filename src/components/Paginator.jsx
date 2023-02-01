import React, { useState, useEffect }from 'react'
import { CPagination, CPaginationItem } from '@coreui/react'
import cookie from 'react-cookies'

const  Paginator = ({count, changeData,cookieName, params,updateParams}) =>  {
    const [pages, setPages] = useState([])
    const {limit,offset} = params
    const [selectedPage, setSelectedPage] = useState(Number(cookie.load(cookieName)) || 1)
    const siblingCount = 5
    let pagesCount = Math.ceil(count / (limit??5) || 1)
    useEffect(() => {
        let p = []
        if(pagesCount < siblingCount){
            for (let i = 1; i <= pagesCount; i++) {
                p.push(i)
            }

        } else {
            let firstPages = [1,2,3]
            let lastPages = [pagesCount-2, pagesCount-1, pagesCount]
            if(selectedPage === 1){
                p = [...firstPages, '...', ...lastPages]
            }
            else if (selectedPage=== pagesCount) {
                p = [...firstPages, '...', ...lastPages]
            }
            else if(firstPages.includes(selectedPage)){
                p = [1,selectedPage-1, selectedPage, selectedPage+1, '...', ...lastPages]
            } else if (lastPages.includes(selectedPage)){
                p = [1,...firstPages, '...',selectedPage-1, selectedPage, selectedPage+1, pagesCount ]
            } else {
                if(firstPages.includes(selectedPage-1)){
                    p= [...firstPages.splice(0,2), selectedPage-1, selectedPage, selectedPage+1,'....', ...lastPages.slice(1) ]
                } else if (lastPages.includes(selectedPage +1 )){
                    p= [...firstPages.splice(0,2), '...', selectedPage-1, selectedPage, selectedPage+1, ...lastPages.slice(1) ]
                } else {

                    p= [...firstPages.splice(0,2), '...', selectedPage-1, selectedPage, selectedPage+1,'....', ...lastPages.slice(1) ]
                }
            }
        }
        
        setPages(() => new Set(p))
    }, [count,selectedPage])
    
    const changePage = n => {
        setSelectedPage(n)
        cookie.save(cookieName, n)
        changeData({...params , limit: limit?? 5, offset: (limit?? 5) * (n - 1)})
        updateParams && updateParams({...params , limit: limit?? 5, offset: (limit?? 5) * (n - 1)})
    }
    return (
        <CPagination aria-label="Page navigation example">
            <CPaginationItem aria-label="Previous" onClick={() => changePage(selectedPage - 1 < 1 ? 1 : selectedPage - 1)} disabled={selectedPage === 1}>
                <span aria-hidden="true">&laquo;</span>
            </CPaginationItem>

            {pages.map((val) => <CPaginationItem disabled={typeof val ==='string' && val.includes('.')} key={`page#${val}`} active={selectedPage === val} onClick={() => changePage(val)}>{val}</CPaginationItem>)}

            <CPaginationItem aria-label="Next" onClick={() => changePage(selectedPage + 1 > pages.length ? pages.length : selectedPage + 1)} disabled={selectedPage === pagesCount}>
                <span aria-hidden="true">&raquo;</span>
            </CPaginationItem>
        </CPagination>
    )
}

export default Paginator