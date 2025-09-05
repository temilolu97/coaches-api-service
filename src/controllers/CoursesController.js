import prisma from "../lib/prisma.js"

const getAllCourses = async (req, res) => {
    const courses = await prisma.course.findMany()
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


export {
    getAllCourses,
    getModulesOfCourses
}