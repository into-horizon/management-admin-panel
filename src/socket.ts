import { io } from 'socket.io-client';

export const socket = process.env.REACT_APP_API && io(process.env.REACT_APP_API);

export const notificationsOffers =io(`${process.env.REACT_APP_API}/notificationsOffers`);
export const notificationsOrders = io(`${process.env.REACT_APP_API}/notificationsOrders`);
export const productReview = io(`${process.env.REACT_APP_API}/productReview`);
export const storeReview = io(`${process.env.REACT_APP_API}/storeReview`);