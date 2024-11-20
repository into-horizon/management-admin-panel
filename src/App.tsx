import React, { FC, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./scss/style.scss";
import { getUser, logout } from "./store/auth";
import { useNavigate } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
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
import {
  socket,
  notificationsOffers,
} from "./socket";
import GlobalDialog from "./components/GlobalDialog";
import Toaster from "./components/Toaster";
import { CCol, CContainer, CRow } from "@coreui/react";
import { RootState } from "./store";
import { isTokenValid } from "./services/helpers";
import ApiService from "./services/ApiService";
import { EventEmitter } from "events";
import LoadingSpinner from "./components/LoadingSpinner";
import { PopupProvider } from "react-custom-popup";
export const events = new EventEmitter();

// Containers
const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));

// Pages
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));
const Verify = React.lazy(() => import("./views/pages/verify/verify"));
const Reference = React.lazy(() => import("./views/pages/password/reference"));
const ResetPassword = React.lazy(
  () => import("./views/pages/password/ResetPassword")
);

type PropsTypes = {
  // getParentCategoriesHandler: (p: ParamsType) => Promise<void>;
  logout: () => Promise<void>;
};

const App: FC<PropsTypes> = ({ logout }) => {
  const dispatch = useDispatch();
  notificationsOffers.on("welcome", (data) => {
    Notification.requestPermission().then((data) => {
      // console.log({ data });
      // new Notification(data)
    });
  });
  const {
    loggedIn,
    user,
    loading: authLoading,
  } = useSelector((state: RootState) => state.login);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [load, setLoad] = useState(true);
  const checkUnAuth = (route: string) => {
    let unAuth = ["/login", "/register", "/reference"] as const;
    if (
      unAuth.some((x) => x === route) ||
      route?.startsWith("/resetPassword")
    ) {
      return true;
    } else return false;
  };

  useEffect(() => {
    let token = cookie.load("access_token");

    Promise.all([Auth.checkAPI(), Auth.checkManagementAPI(), socket.connect()])
      .then(() => {
        let tabID = sessionStorage.tabID
          ? sessionStorage.tabID
          : (sessionStorage.tabID = (Math.random() * 1000).toFixed(0));
        location.pathname === "/500" && navigate("/");
        cookie.save(`current_path${sessionStorage.tabID}`, location.pathname, {
          path: "/",
        });

        let lang = localStorage.getItem("i18nextLng");
        if (lang) {
          i18n.changeLanguage(lang);
        } else {
          i18n.changeLanguage("en");
        }

        let currentPath = location.pathname;
        if (token && !loggedIn) {
          if (!isTokenValid()) {
            ApiService.refresh().then(() => dispatch(getUser()));
          } else {
            dispatch(getUser());
          }
        } else if (loggedIn && user.id) {
          dispatch(getParentCategoriesHandler());
          navigate(checkUnAuth(currentPath) ? "/" : currentPath);
          setLoad(false);
        } else if (!loggedIn && !token) {
          let path = checkUnAuth(currentPath) ? currentPath : "/login";
          cookie.save(`current_path${sessionStorage.tabID}`, path, {
            path: "/",
          });
          navigate(path);
          setLoad(false);
        }
      })
      .catch(() => {
        navigate("/500");
        setLoad(false);
      });
  }, [loggedIn]);

  const loading = (
    <div className="pt-3 text-center">
      <div className="sk-spinner sk-spinner-pulse"></div>
    </div>
  );

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
      <React.Suspense fallback={<LoadingSpinner/>}>
        <Toaster />
        <GlobalDialog />
        {load && (
          <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
              <CRow className="justify-content-center">
                <CCol xs="auto">
                  <Rings height="35rem" width="150" color="blue" />
                </CCol>
              </CRow>
            </CContainer>
          </div>
        )}

        {!load && (
          <div>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/500" element={<Page500 />} />
              <Route path="/reference" element={<Reference />} />
              <Route
                path="/resetPassword/:token"
                element={<ResetPassword load={(x: boolean) => setLoad(x)} />}
              />
              <Route path="/*" element={<DefaultLayout />} />
              <Route path="*" element={<Page404 />} />
            </Routes>
          </div>
        )}
      </React.Suspense>
    </PopupProvider>
  );
};

const mapStateToProps = (state: RootState) => ({
  login: state.login,
});
const mapDispatchToProps = {
  getParentCategoriesHandler,
  getChildCategoriesHandler,
  getGrandChildCategoriesHandler,
  logout,
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
