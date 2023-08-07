import express from 'express'
import {checkOut,paymentVerify} from './../controllers/paymentcontroller.js'

const router=express.Router()

router.route("/checkOut").post(checkOut);
router.route("/paymentVerify").post(paymentVerify);

export default router  