import 'react-app-polyfill/stable'
import 'core-js'
import React, { Suspense } from 'react'
// import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import './i18next'
import {
  createBrowserRouter,
  BrowserRouter as Router,
  RouterProvider,
} from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import routes from './routes'
import store from './store'
const router = createBrowserRouter(routes)

const container = document.getElementById('root')!

const root = createRoot(container)
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
