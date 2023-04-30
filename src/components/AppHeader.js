import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch, connect } from "react-redux";
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CButton,
  CAlert,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from "@coreui/icons";

import { AppBreadcrumb } from "./index";
import { AppHeaderDropdown } from "./header/index";
import { logo } from "src/assets/brand/logo";
import { populateStore } from "src/store/filter";

const AppHeader = ({populateStore}) => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.changeState.sidebarShow);
  const { store } = useSelector((state) => state.filter);
  const onClose = ()=>{
    populateStore()
  }
  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: "set", sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CIcon icon={logo} height={48} alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CNavLink to="/dashboard" component={NavLink} className="active">
              Dashboard
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Users</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Settings</CNavLink>
          </CNavItem>
        </CHeaderNav>
       
          <CAlert color="info" dismissible  style={{ margin: "auto" }} visible={!!store.id} onClose={onClose}>
            {`Populated store: ${store.title??'store'}`}
          </CAlert>
        
        {/* <CButton
          color="primary"
          onClick={() =>
            i18n.changeLanguage(i18n.language === "en" ? "ar" : "en")
          }
        >
          {t("lang")}
        </CButton> */}
        <CHeaderNav>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  );
};

export default connect(null, {populateStore})( AppHeader);
