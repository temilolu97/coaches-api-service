import { Router } from "express";
import { createCourse, createCourseCategory, createCourseLevel, createCourseModule, getAllCourseCategories, getAllCourseLevels, getAllCourses } from "../controllers/AdminController.js";

const router = Router()

router.get("/courses/get",getAllCourses)
router.post("/courses/create", createCourse)
router.post("/courses/create-module", createCourseModule)
router.post("/courses/level/create", createCourseLevel)
router.post("/courses/category/create", createCourseCategory)
router.get("/courses/levels", getAllCourseLevels)
router.get("/courses/categories", getAllCourseCategories)


export default router