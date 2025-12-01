import {Router} from "express";
import { 
    checkUsernameAvailability, 
    loginHandler, 
    signupHandler, 
    getTokenHandler, 
    sendTempCodeHandler, 
    resetPasswordHandler 
} from "../handler/userAuthHandler.ts";    

const userRouter = Router();

userRouter.route('/signup').post(signupHandler);
userRouter.route('/login').post(loginHandler);
userRouter.route('/checkUsername').get(checkUsernameAvailability);
userRouter.route('/forgotPassword').post(sendTempCodeHandler);
userRouter.route('/resetPassword').post(resetPasswordHandler);
// userRouter.route('/verification').get(verifyUser);
userRouter.route('/getToken').get(getTokenHandler);

export default userRouter;