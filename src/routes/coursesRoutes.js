import { Router } from "express";
import { getAllCourseCategories, getAllCourseLevels, getAllCourses, getModulesOfCourses } from "../controllers/CoursesController.js";

const router = Router()

router.get("/", getAllCourses)
router.get("/:courseId/modules/get", getModulesOfCourses)
router.get("/categories/all", getAllCourseCategories)
router.get("/levels/all", getAllCourseLevels)



export default router