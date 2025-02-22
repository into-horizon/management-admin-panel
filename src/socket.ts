import { io } from 'socket.io-client'
import { apiURL } from './environment/index'

export const socket = io(apiURL!)

export const notificationsOffers = io(`${apiURL}/notificationsOffers`)
export const notificationsOrders = io(`${apiURL}/notificationsOrders`)
export const productReview = io(`${apiURL}/productReview`)
export const storeReview = io(`${apiURL}/storeReview`)
export const orders = io(`${apiURL}/orders`)
export const products = io(`${apiURL}/products`)
export const notifications = io(`${apiURL}/administrationNotifications`)
