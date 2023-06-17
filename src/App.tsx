import React, { Component, FC, useEffect, useState } from "react";
import { HashRouter, Route, Routes, useParams } from "react-router-dom";
import "./scss/style.scss";
import { PopupProvider } from "react-custom-popup";
import { getUser, logout } from "./store/auth";
import { useNavigate } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import cookie from "react-cookies";
import { useTranslation } from "react-i18next";
import { Rings } from "react-loader-spinner";
import {
  getParentCategoriesHandler,
  getChildCategoriesHandler,
  getGrandChildCategoriesHandler,
} from "./store/category";
import "react-select-search/style.css";
import Auth from "./services/Auth";
import { socket, notificationsOffers } from "./socket";
import GlobalDialog from "./components/GlobalDialog";



import Toaster from "./components/Toaster";
import { CCol, CRow } from "@coreui/react";

// Containers
const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));

// Pages
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Register = React.lazy(() => import("./views/pages/register/Register"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));
const Verify = React.lazy(() => import("./views/pages/verify/verify"));
const Reference = React.lazy(() => import("./views/pages/password/reference"));
const ResetPassword = React.lazy(() => import("./views/pages/password/ResetPassword"));

type PropsTypes = {
  getParentCategoriesHandler: ()=> void
  getUser: ()=> void
  logout: ()=> void
}

const App : FC<PropsTypes> = ({
  getParentCategoriesHandler,
  getUser,
  logout
}) => {
  
  const {
    loggedIn,
    user: { id },
  } = useSelector((state) => state.login);

  const navigate = useNavigate();
  const to = useParams().token;
  const { t, i18n } = useTranslation();
  const [load, setLoad] = useState(true);
  let token = cookie.load("access_token");
  const checkUnAuth = (route : string) => {
    let unAuth = ["/login", "/register", "/reference"];
    if (
      unAuth.some((x) => x === route) ||
      route?.startsWith("/resetPassword")
    ) {
      return true;
    } else return false;
  };
  socket.on('connect', () => {
    console.log('connected successfully');
    notificationsOffers.emit('offerNotification', { id: '123' })
  })
  useEffect(() => {

    Promise.all([new Auth().checkAPI(), new Auth().checkManagementAPI(), socket.connect()]).then(() => {
      let tabID = sessionStorage.tabID
        ? sessionStorage.tabID
        : (sessionStorage.tabID = (Math.random() * 1000).toFixed(0));
      window.location.pathname === '/500' && navigate('/')
      cookie.save(
        `current_path${sessionStorage.tabID}`,
        window.location.pathname,
        {path:'/'}
      );

      let lang = localStorage.getItem("i18nextLng");
      if (lang) {
        i18n.changeLanguage(lang);
      } else {
        i18n.changeLanguage("en");
      }

      if (!id && token) {
        try {
          getUser();
        } catch (error) {
          logout()
        }
      }
      let currentPath = cookie.load(`current_path${sessionStorage.tabID}`);
      if (loggedIn) {
        getParentCategoriesHandler();
        navigate(checkUnAuth(currentPath) ? "/" : currentPath);
        setLoad(false);
      } else if (!loggedIn && !token) {
        let path = checkUnAuth(currentPath) ? currentPath : "/login";
        cookie.save(`current_path${sessionStorage.tabID}`, path, { path: "/" });
        navigate(path);
        setLoad(false);
      }
    }).catch(() => {
      logout()
      navigate('/500')
      setLoad(false)
    })

  }, [loggedIn]);

  // useEffect(() => {
  // }, [loggedIn]);
  const loading  = (

      <div className="pt-3 text-center">
         <div className="sk-spinner sk-spinner-pulse"></div>
       </div>

  ) 
 
    
    
    
  useEffect(() => {
    if (i18n.language === "en") {
      document.documentElement.setAttribute("lang", "en");
      document.documentElement.setAttribute("dir", "ltl");
    } else if (i18n.language === "ar") {
      document.documentElement.setAttribute("lang", "ar");
      document.documentElement.setAttribute("dir", "rtl");
    }
  }, [i18n.language]);

  return (
    <PopupProvider>
      <React.Suspense fallback={loading}>
        <Toaster />
        <GlobalDialog/>
        {load && (
          <CRow className="justify-content-center align-items-center">
            <CCol xs='auto'>
              <Rings height="35rem" width="150" color="blue" />
            </CCol>
          </CRow>
        )}

        {!load && (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
            
              path="/register"
              
              element={<Register />}
            />
            <Route path="/verify"  element={<Verify />} />
            <Route path="/500"  element={<Page500 />} />
            <Route path="/reference"  element={<Reference />} />
            <Route
              path="/resetPassword/:token"
              element={<ResetPassword load={(x: boolean) => setLoad(x)} />}
            />
            <Route path="/*" element={<DefaultLayout />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        )}
      </React.Suspense>
    </PopupProvider>
  );
};

const mapStateToProps = (state) => ({
  login: state.login,
});
const mapDispatchToProps = {
  getUser,
  getParentCategoriesHandler,
  getChildCategoriesHandler,
  getGrandChildCategoriesHandler,
  logout
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
