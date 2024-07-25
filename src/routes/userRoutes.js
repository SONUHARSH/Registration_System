
import { Router } from "express";
import { Userregister, Userlogin, getSessionDetails } from "../controllers/userController.js";
import { verifyJWT } from "../middlewares/auth.js";

const router = Router();

router.route("/register").post(Userregister);
router.route("/login").post(Userlogin);
router.route("/session").post(verifyJWT, getSessionDetails );

export default router

