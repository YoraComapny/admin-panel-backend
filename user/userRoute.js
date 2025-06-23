import { Signup , Login} from "./userController.js";
import express from "express";

const router = express.Router();

router.post("/signup", Signup);  //working fine
router.post("/login", Login);    //working fine

export default router;
