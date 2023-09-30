import jwt from "jsonwebtoken";
import cookie from "react-cookies";

export const setDate = (days: number = 0): string => {
  let date = new Date(Date.now() - 1000 * 60 * 60 * 24 * days);
  const formattedDate = Intl.DateTimeFormat("en", {
    month: "2-digit",
    year: "numeric",
    day: "2-digit",
  }).format(date);
  return formattedDate;
};

export const isTokenValid = (): boolean => {
  try {
    let token = cookie.load("access_token");
    jwt.verify(token, process.env.REACT_APP_SECRET!);
    return true;
  } catch (error) {
    return false;
  }
};
