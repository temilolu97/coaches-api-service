import { Router } from "express";
import { getLocalGovernments } from "../controllers/MiscellaneousController.js";

const router = Router()

router.get("/lgas", getLocalGovernments)
export default router