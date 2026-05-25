import { FRONTEND_URL } from "../../configs/serverConfig.js";
import authServices from "./auth.service.js";
import { AppError } from "../../utils/error.class.js";
import authUtil from "../../utils/authorize.util.js";
import authDomain from "./auth.domain.js";
import { sequelize } from "../../configs/database.js";
import userRepository from "../user/user.repository.js";

async function checkEmailExists(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      throw new AppError(400, "Email is required");
    }
    const user = await userRepository.getUserByEmail(email);
    res.status(200).json({ exists: !!user });
  } catch (error) {
    next(error);
  }
}

async function googleAuthRetrieveInfo(req, res, next) {
  try {
    const user = await authServices.googleAuthRetrieveInfo(req.body);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}
async function googleAuthSignin(req, res, next) {
  try {
    const result = await authServices.googleAuthSignin(req.body.payload);
    const rememberMe = req.body.payload.rememberMe;
    const { refreshToken, accessToken, user, status } = result;
    if (rememberMe) {
      res
        .cookie("refreshToken", refreshToken, authDomain.cookieOptions)
        .status(status)
        .json({ accessToken, user });
      return;
    } else {
      console.log("im going to forget him");
      res
        .cookie("refreshToken", refreshToken, authDomain.forgetMeCookieOptions)
        .status(status)
        .json({ accessToken, user });
      return;
    }
  } catch (error) {
    next(error);
  }
}

export async function verifyAccountByDigits(req, res, next) {
  try {
    const token = req.body.token;
    const email = req.body.email;
    const success = await authServices.verifyAccountConfirm(token, email);
    if (!success)
      return res
        .status(400)
        .json({ success: false, message: "Account already verified" });
    res.status(200).json({ success: true, message: "Account verified" });
  } catch (error) {
    next(error);
  }
}
export async function resendVerificationEmail(req, res, next) {
  try {
    const email = req.body.email;
    const success = await authServices.resendVerificationEmail(email);
    if (!success)
      return res
        .status(400)
        .json({ success: false, message: "Ops, something went wrong" });
    res.status(200).json({ success: true, message: "Email sent" });
  } catch (error) {
    next(error);
  }
}
export async function login(req, res, next) {
  try {
    const results = await authServices.loginUser(req.body);
    const rememberMe = req.body.rememberMe;
    const { refreshToken, accessToken, user, status } = results;

    if (rememberMe) {
      res
        .cookie("refreshToken", refreshToken, authDomain.cookieOptions)
        .status(200)
        .json({ accessToken: accessToken, user });
      return;
    } else {
      res
        .cookie("refreshToken", refreshToken, authDomain.forgetMeCookieOptions)
        .status(200)
        .json({ accessToken, user });
      return;
    }
  } catch (error) {
    next(error);
  }
}
export async function loginToken(req, res, next) {
  try {
    const user = await authServices.loginToken(req.auth);
    res.send(user);
  } catch (error) {
    next(error);
  }
}
export async function verifyUserManual(req, res, next) {
  try {
    await authUtil.checkRoleAndPermission(
      req.auth,
      ["admin", "super_admin"],
      true,
      "user",
      "verify",
    );
    await authServices.verifyUserManual(req.params.id, true);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

export async function refreshUserToken(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(401, "missing cookie", true, "missing cookie");
    }
    const accessToken = await authServices.refreshUserToken(refreshToken);
    res.send({ success: true, accessToken });
  } catch (error) {
    next(error);
  }
}
export async function getUserProfile(req, res, next) {
  try {
    const user = await authServices.getUserProfile(req.auth.id);
    res.send(user);
  } catch (error) {
    next(error);
  }
}
export async function updatePassword(req, res, next) {
  try {
    await authServices.updatePassword({
      userId: req.auth.id,
      oldPassword: req.body.password,
      newPassword: req.body.newPassword,
    });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}
export async function passwordReset(req, res, next) {
  try {
    await authServices.passwordReset(req.body.email);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}
export async function passwordResetConfirm(req, res, next) {
  try {
    await authServices.passwordResetConfirm(req.body);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}
export async function verifyResetCode(req, res, next) {
  try {
    const result = await authServices.verifyResetCode(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
const authController = {
  checkEmailExists,
  googleAuthRetrieveInfo,
  googleAuthSignin,
  getUserProfile,
  verifyAccountByDigits,
  resendVerificationEmail,
  login,
  loginToken,
  verifyUserManual,
  refreshUserToken,
  updatePassword,
  passwordReset,
  passwordResetConfirm,
  verifyResetCode,
};

export default authController;
