import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { handlePaymentHook, initiatePayment } from "../controllers/PaymentsController.js";

const router = Router()

router.post("/initiate", authenticateToken, initiatePayment)
router.post("/budpay/hook", handlePaymentHook)


export default router