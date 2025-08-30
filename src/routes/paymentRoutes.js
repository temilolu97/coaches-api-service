import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { handlePaymentHook, initiatePayment, initiatePaymentPaystack, receivePaystackHook } from "../controllers/PaymentsController.js";

const router = Router()

router.post("/initiate", authenticateToken, initiatePayment)
router.post("/paystack/initiate",authenticateToken, initiatePaymentPaystack)

router.post("/budpay/hook", handlePaymentHook)
router.post("/paystack/hook", receivePaystackHook)


export default router