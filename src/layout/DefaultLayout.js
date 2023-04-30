import CIcon from "@coreui/icons-react";
import { CButton, CCol, CForm, CFormInput, CFormLabel, CRow, CTooltip } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AppContent,
  AppSidebar,
  AppFooter,
  AppHeader,
} from "../components/index";
import Draggable from 'react-draggable';
import { cilFilterSquare, cilShieldAlt, cilCursorMove, cilFilter, cilFilterX } from "@coreui/icons";
import SearchDropdown from "src/components/SearchDropdown";
import { searchForStore } from '../store/store'
import { populateStore } from "src/store/filter";

const DefaultLayout = ({ searchForStore, populateStore }) => {
  const [filterVisible, setVisibleFilter] = useState(false)
  const [selectedStore, setSelectedStore] = useState({})
  const { searched } = useSelector(state => state.stores)
  const { duration, store } = useSelector(state => state.filter)
  const setDateByDays = (days = 0) => {
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    let date = new Date(Date.now() - 1000 * 60 * 60 * 24 * days)
    return `${date.getFullYear()}-${months[date.getMonth()]}-${date.getDate()}`
  }
  const setDate = date => {
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

    date = new Date(date)
    let day = `0${date.getDate()}`.slice(-2)
    return `${date.getFullYear()}-${months[date.getMonth()]}-${day}`
  }
  const submitHandler = e => {
    e.preventDefault();
    populateStore({ store: selectedStore, duration: `${e.target.from.value}&${e.target.to.value}` })
  }
  const resetHandler  = e => {

    e.target.reset()
    populateStore()
  }
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <Draggable handle="strong" axis="y" >
            <div className="filter">

              <CRow className="justify-content-center" xs={{ gutterY: 3 }}>
                <CCol xs={12}>
                  <CTooltip content='move'>

                    <strong style={{ margin: 'auto', textAlign: 'center' }} className="cursor move">
                      <div>
                        <CIcon style={{ margin: 'auto' }} icon={cilCursorMove} size='lg' />
                      </div>
                    </strong>
                  </CTooltip>
                </CCol>
                <CCol xs={12} style={{ justifyContent: 'center', display: 'flex' }}>
                  <CTooltip content="select seller">
                    <CButton color="info" size="lg" onClick={() => setVisibleFilter(x => !x)} >
                      <CIcon icon={cilFilterSquare} size="xl" />
                    </CButton>
                  </CTooltip>

                </CCol>
                {filterVisible && <CForm onSubmit={submitHandler} onReset={resetHandler}>
                  <CRow className="justify-content-center" xs={{ gutterY: 3 }}>
                    <CCol xs={10}>

                      <SearchDropdown c='search-dropdown' options={searched.map(store => { return { id: store.id, title: store.store_name } })} placeholder='search for store by store name, email or mobile number' onChange={e => searchForStore({ query: e })} onSelect={e => setSelectedStore(e)} />
                    </CCol>
                    <CRow className="justify-content-center">

                      <CCol xs='auto'>
                        <CFormLabel htmlFor="from">from</CFormLabel>
                        <CFormInput name="from" type="date" defaultValue={setDate(duration?.split('&')[0])} max={setDateByDays()} />
                      </CCol>
                      <CCol xs='auto'>
                        <CFormLabel htmlFor="to">to</CFormLabel>
                        <CFormInput name="to" type="date" defaultValue={setDate(duration?.split('&')[1])} max={setDateByDays()} />
                      </CCol>

                    </CRow>
                    <CCol xs='auto'>
                      <CTooltip content='apply filter'>

                        <CButton type="submit"><CIcon icon={cilFilter} /></CButton>
                      </CTooltip>
                    </CCol>
                    <CCol xs='auto'>
                      <CTooltip content='clear filter' >

                        <CButton color="secondary" type="reset"><CIcon icon={cilFilterX} /></CButton>
                      </CTooltip>
                    </CCol>
                  </CRow>
                </CForm>

                }

              </CRow>
            </div>
          </Draggable>
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  login: state.login,
});

export default connect(mapStateToProps, { searchForStore, populateStore })(DefaultLayout);
