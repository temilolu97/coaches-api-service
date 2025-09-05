import prisma from "../lib/prisma.js"

const createCourse = async (req, res) => {
    try {
        const { title, category, price, level, description } = req.body
        if (!title || !category || !level || !description) {
            return res.status(400).json({
                message: "Please provide all the necessary requirements"
            })
        }
        const newCourse = await prisma.course.create({
            data: {
                title,
                description,
                price: price,
                level,
                category
            }
        })

        return res.status(201).json({
            message: "Course created successfully",
        })
    }
    catch(err){
        console.log(err);
        
        return res.status(500).json({
            message:"Unable to create course at the moment",
            err
        })
    }
    
}

const createCourseModule =async(req,res) =>{
    const {courseId, title, content, videoUrl,fileUrl } = req.body
    const course = await prisma.course.findFirst({
        where:{
            id: courseId
        }
    })
    if(!course) return res.status(400).json({
        message:"Course id provided doesn't match any course"
    })
    //check if there is currently a module for this course
    const moduleExists =  await prisma.module.findFirst({
        where:{
            courseId
        }
    })
    let currentOrder = 0
    let order
    if(moduleExists){
        //get the last order
        currentOrder = Number(moduleExists.order)
    }

    order = moduleExists ? currentOrder +1 : 1
    const payload ={
        title,
        courseId,
        content,
        videoUrl,
        fileUrl,
        order
    }
    const newModule = await prisma.module.create({
        data:payload
        
    })
    return res.status(201).json({
        message:`Module added to course ${course.title}`,
        data:newModule
    })
}

const getAllCourses = async(req,res) =>{
    const courses = await prisma.course.findMany({
        include:{
            modules:true
        }
    })
    return res.status(200).json({
        message:"Courses fetched successfully",
        data:courses
    })
}

const getAllCourseLevels = async (req, res) => {
    const levels = await prisma.courseLevel.findMany()
    return res.status(200).json({
        message: "Course levels fetched successfully",
        data: levels
    })
}

const getAllCourseCategories = async (req, res) => {
    const categories = await prisma.courseCategory.findMany()
    return res.status(200).json({
        message: "Course categories fetched successfully",
        data: categories
    })
}

const createCourseCategory = async (req, res) => {
    const { name } = req.body
    if (!name) {
        return res.status(400).json({
            message: "Category is required"
        })
    }
    const newLevel = await prisma.courseCategory.create({
        data: {
            name: name.trim()
        }
    })
    return res.status(201).json({
        message: "Course Category created successfully",
        data: newLevel
    })
}

const createCourseLevel = async (req, res) => {
    const { name } = req.body
    if (!name) {
        return res.status(400).json({
            message: "Level is required"
        })
    }
    const newLevel = await prisma.courseLevel.create({
        data: {
            name: name.trim()
        }
    })
    return res.status(201).json({
        message: "Course level created successfully",
        data: newLevel
    })
}

export {
    getAllCourses,
    createCourse,
    createCourseCategory,
    createCourseLevel,
    getAllCourseCategories,
    getAllCourseLevels,
    createCourseModule
}