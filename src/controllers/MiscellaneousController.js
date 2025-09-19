import prisma from "../lib/prisma.js"

const getLocalGovernments = async (req, res) => {
    const lgas = await prisma.localGovernment.findMany()
    return res.status(200).json({
        message: "Local governments fetched successfully",
        data: lgas
    })

}
// const getProfile = async (req, res) => {
//     try {
//         const { id } = req.user
//         const user = await prisma.user.findFirst({
//             where: {
//                 id
//             }
//         })
//         return res.status(200).json({
//             message:"Profile fetched successfully",
//             data:user
//         })
//     }
//     catch (err) {
//         console.error(err)
//     }
// }
export {
    getLocalGovernments
}