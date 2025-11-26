import {Router} from "express";
import { checkUsernameAvailability, loginHandler, signupHandler, verifyUser } from "../handler/userAuthHandler.ts";

const userRouter = Router();

userRouter.route('/signup').post(signupHandler);
userRouter.route('/login').post(loginHandler);
userRouter.route('/checkUsername').get(checkUsernameAvailability);
userRouter.route('/verification').post(verifyUser)

export default userRouter;