import "react-app-polyfill/stable";
import "core-js";
import React, { Suspense } from "react";
// import ReactDOM from 'react-dom'
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import store from "./store/index";
import "./i18next";
import { BrowserRouter as Router } from "react-router-dom";
import { createRoot } from "react-dom/client";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);
const container = document.getElementById("root")!;

const root = createRoot(container);
root.render(
  <Provider store={store}>
    <Router>
      <Suspense fallback={loading}>
        <App />
      </Suspense>
    </Router>
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
