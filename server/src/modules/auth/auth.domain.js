import { NODE_ENV, REFRESH_COOKIE_AGE } from "../../configs/serverConfig.js";
const cookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === "production" ? true : false,
  sameSite: "lax",
  maxAge: REFRESH_COOKIE_AGE,
  path: "/",
};
const forgetMeCookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === "production" ? true : false,
  sameSite: "lax",
  path: "/",
};
const authDomain = { cookieOptions, forgetMeCookieOptions };
export default authDomain;
