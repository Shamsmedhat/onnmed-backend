import { Router } from "express";
import { checkEmail, validateLogin } from "../../middleware/check-email.middleware.js";
import { login, signup } from "./auth.controller.js";

const authRouter = Router()

authRouter.post("/signup", checkEmail, signup);
authRouter.post("/signin", validateLogin, login);
// authRouter.post("/signup", validateCaptcha, checkEmail, hashPassword , signup);

export default authRouter