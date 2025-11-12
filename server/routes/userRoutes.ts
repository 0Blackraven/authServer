import {Router} from "express";
import { checkUsernameAvailability, loginHandler, signupHandler } from "../handler/userHandler.ts";

const userRouter = Router();

userRouter.route('/signup').post(signupHandler);
userRouter.route('/login').post(loginHandler);
userRouter.route('/checkUsername').get(checkUsernameAvailability);

export default userRouter;