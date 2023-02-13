import CIcon from "@coreui/icons-react";
import { CButton, CCol, CRow, CTooltip } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AppContent,
  AppSidebar,
  AppFooter,
  AppHeader,
} from "../components/index";
import { cilFilterSquare, cilShieldAlt } from "@coreui/icons";
import SearchDropdown from "src/components/SearchDropdown";
import {searchForStore,populateStore} from '../store/store'
const DefaultLayout = ({searchForStore,populateStore}) => {
  const [filterVisible, setVisibleFilter] = useState(false)
  const history = useNavigate();
  const {searched} = useSelector(state=> state.stores)
  // useEffect(() => {
  //   if(!login.loggedIn){
  //     history.push('/login')
  //   }
  // },[])
  // useEffect(() => {
  //   if(!login.loggedIn){
  //     history.push('/login')
  //   }
  // },[login.loggedIn])

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <CRow className="filter justify-content-end">
            <CCol xs='auto'>
            <CTooltip content="select seller">
              <CButton color="primary" size="lg" onClick={()=> setVisibleFilter(x=> !x)}>
                <CIcon icon={cilFilterSquare} size="xl" />
              </CButton>
            </CTooltip>

            </CCol>
            {filterVisible&& <CCol xs={12}>

            <SearchDropdown c='search-dropdown' options={searched.map(store=> {return{id: store.id, title: store.store_name }})} placeholder='search for store' onChange={e=> searchForStore({query: e})} onSelect={e => populateStore(e)}/>
            </CCol>}
          </CRow>
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

export default connect(mapStateToProps,{searchForStore,populateStore})(DefaultLayout);
