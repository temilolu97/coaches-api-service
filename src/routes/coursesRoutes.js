import { Router } from "express";
import { getAllCourses, getModulesOfCourses } from "../controllers/CoursesController.js";

const router = Router()

router.get("/", getAllCourses)
router.get("/:courseId/modules/get", getModulesOfCourses)

export default router