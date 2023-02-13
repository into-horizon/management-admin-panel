import React, { Component, useEffect, useState } from "react";
import { HashRouter, Route, Routes, useParams } from "react-router-dom";
import "./scss/style.scss";
import { PopupProvider } from "react-custom-popup";
import { getUser } from "./store/auth";
import { useNavigate } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import cookie from "react-cookies";
import { If, Then, Else } from "react-if";
import { useTranslation } from "react-i18next";
import { Rings } from "react-loader-spinner";
import {
  getParentCategoriesHandler,
  getChildCategoriesHandler,
  getGrandChildCategoriesHandler,
} from "./store/category";
import { getAddress } from "./store/address";
import "react-select-search/style.css";
import Auth from "./services/Auth";
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);
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
const ResetPassword = React.lazy(() =>
  import("./views/pages/password/ResetPassword")
);

const App = ({
  getParentCategoriesHandler,
  getChildCategoriesHandler,
  getGrandChildCategoriesHandler,
  getUser,
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
  const checkUnAuth = (route) => {
    let unAuth = ["/login", "/register", "/reference"];
    if (
      unAuth.some((x) => x === route) ||
      route?.startsWith("/resetPassword")
    ) {
      return true;
    } else return false;
  };
  useEffect(() => {
    Promise.all([new Auth().checkAPI(), new Auth().checkManagementAPI()]).then(()=>{
      let tabID = sessionStorage.tabID
        ? sessionStorage.tabID
        : (sessionStorage.tabID = (Math.random() * 1000).toFixed(0));
        window.location.pathname === '/500' && navigate('/')
         cookie.save(
        `current_path${sessionStorage.tabID}`,
        window.location.pathname
      );
  
      let lang = localStorage.getItem("i18nextLng");
      if (lang) {
        i18n.changeLanguage(lang);
      } else {
        i18n.changeLanguage("en");
      }
  
      if (!id && token) {
        getUser();
      }

    }).catch(()=> {
      setLoad(false)
      navigate('/500')
    })
  }, []);

  useEffect(() => {
    let currentPath = cookie.load(`current_path${sessionStorage.tabID}`);

    if (loggedIn) {
      getParentCategoriesHandler();
      // getChildCategoriesHandler();
      // getGrandChildCategoriesHandler();
      navigate(checkUnAuth(currentPath) ? "/" : currentPath);
      setLoad(false);
    } else if (!loggedIn && !token) {
      let path = checkUnAuth(currentPath) ? currentPath : "/login";
      cookie.save(`current_path${sessionStorage.tabID}`, path, { path: "/" });
      navigate(path);
      setLoad(false);
    }
  }, [loggedIn]);

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
        {load && (
          <CRow className="justify-content-center align-items-center"
          // style={{
          //   display: "flex",
          //   justifyContent: "center",
          //   alignItems: "center",
          // }}
          >
            <CCol xs='auto'>
             <Rings height="35rem" width="150" color="blue"/>
            </CCol>
          </CRow>
        )}

        {!load && (
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route
              exact
              path="/register"
              name="Register Page"
              element={<Register />}
            />
            <Route exact path="/verify" name="verify" element={<Verify />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route path="/reference" name="reference" element={<Reference />} />
            <Route
              path="/resetPassword/:token"
              name="password reset"
              element={<ResetPassword load={(x) => setLoad(x)} />}
            />
            <Route path="/*" name="Home" element={<DefaultLayout />} />
            <Route path="*" name="Page 404" element={<Page404 />} />
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
  getAddress,
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
