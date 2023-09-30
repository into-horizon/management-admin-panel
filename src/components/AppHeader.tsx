import React, { useEffect, useRef, useState } from "react";
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
  CListGroupItem,
  CListGroup,
  CCol,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from "@coreui/icons";

import { AppBreadcrumb } from "./index";
import { AppHeaderDropdown } from "./header/index";
import { logo } from "src/assets/brand/logo";
import { populateStore } from "src/store/filter";
import { RootState } from "src/store";

type PropTypes = {
  populateStore: () => void;
};
const AppHeader = ({ populateStore }: PropTypes) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState<boolean>(false);
  const dropdown = useRef<HTMLDivElement>(null);
  const sidebarShow = useSelector(
    (state: RootState) => state.changeState.sidebarShow
  );
  const { store } = useSelector((state: RootState) => state.filter);
  const onClose = () => {
    populateStore();
  };
  useEffect(() => {
    if (visible) {
      document.addEventListener("click", (e) => {
        if (!dropdown?.current?.contains(e.target as Node)) {
          setVisible(false);
        }
      });
    } else {
      document.removeEventListener("click", (e) => {
        if (!dropdown?.current?.contains(e.target as Node)) {
          setVisible(false);
        }
      });
    }
  }, [visible]);
  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: "set", sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none">
          <CIcon icon={logo} height={48} />
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

        <CAlert
          color="info"
          dismissible
          style={{ margin: "auto" }}
          visible={!!store.id}
          onClose={onClose}
        >
          {`Populated store: ${store?.title ?? "store"}`}
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
          <CNavItem className="position-relative">
            <div ref={dropdown}>
              <CNavLink
                component="button"
                className=" border-0 bg-transparent"
                onClick={() => setVisible((visible) => !visible)}
              >
                <CIcon icon={cilBell} size="lg" />
                {visible && (
                  <CListGroup className="position-absolute end-0">
                    <CListGroupItem component="a" href="#" className="w-15">
                      <CRow className="justify-content-between">
                        <CCol xs={12}>
                          <p className="text-align-left m-0">
                            <span>
                              Lorem, ipsum dolor sit amet consectetur
                              adipisicing elit. Vel, suscipit?
                            </span>
                          </p>
                        </CCol>
                        <CCol xs={12}>
                          <p className="m-0 text-align-right">
                            <sub>
                              {Intl.DateTimeFormat("en", {
                                minute: "2-digit",
                                hourCycle: "h12",
                                hour: "2-digit",
                              }).format(new Date())}
                            </sub>
                          </p>
                        </CCol>
                      </CRow>
                    </CListGroupItem>
                    <CListGroupItem component="a" href="#">
                      Dapibus ac facilisis in
                    </CListGroupItem>
                    <CListGroupItem component="a" href="#">
                      Morbi leo risus
                    </CListGroupItem>
                    <CListGroupItem component="a" href="#">
                      Porta ac consectetur ac
                    </CListGroupItem>
                    <CListGroupItem component="a" href="#">
                      Vestibulum at eros
                    </CListGroupItem>
                  </CListGroup>
                )}
              </CNavLink>
            </div>
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

export default connect(null, { populateStore })(AppHeader);
