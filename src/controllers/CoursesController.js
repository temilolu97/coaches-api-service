import prisma from "../lib/prisma.js"

const getAllCourses = async (req, res) => {
    const {category} = req.query
    console.log(category);
    
    let courses
    if(category){
        courses = await prisma.course.findMany({
            where:{
                category
            }
        })
    }
    else{
        courses =  await prisma.course.findMany()
    }
    return res.status(200).json({
        message: "Courses fetched successfully",
        data: courses
    })

}

const getModulesOfCourses = async (req,res) =>{
    const {courseId} = req.params
    console.log(courseId);
    
    const course = await prisma.course.findFirst({
        where:{
            id:Number(courseId)
        }
    })
    const modules = await prisma.module.findMany({
        where:{
            courseId:course.id
        }
    })

    return res.status(200).json({
        message:`Modules fetched for course- ${course.title}`,
        data:modules
    })
}

const getAllCourseCategories = async (req, res) => {
    const categories = await prisma.courseCategory.findMany()
    return res.status(200).json({
        message: "Course categories fetched successfully",
        data: categories
    })
}

const getAllCourseLevels = async (req, res) => {
    const levels = await prisma.courseLevel.findMany()
    return res.status(200).json({
        message: "Course levels fetched successfully",
        data: levels
    })
}

export {
    getAllCourses,
    getModulesOfCourses,
    getAllCourseCategories,
    getAllCourseLevels
}