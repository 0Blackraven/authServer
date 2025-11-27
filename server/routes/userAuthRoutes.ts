import {Router} from "express";
import { checkUsernameAvailability, loginHandler, signupHandler, verifyUser, sendTempCodeHandler, resetPasswordHandler } from "../handler/userAuthHandler.ts";

const userRouter = Router();

userRouter.route('/signup').post(signupHandler);
userRouter.route('/login').post(loginHandler);
userRouter.route('/checkUsername').get(checkUsernameAvailability);
userRouter.route('/verification').post(verifyUser);
userRouter.route('/forgotPassword').post(sendTempCodeHandler);
userRouter.route('/resetPassword').post(resetPasswordHandler);

export default userRouter;