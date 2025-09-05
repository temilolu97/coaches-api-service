import prisma from "../lib/prisma.js"

const getLocalGovernments = async (req,res) => {
    const lgas = await prisma.localGovernment.findMany()
    return res.status(200).json({
        message:"Local governments fetched successfully",
        data:lgas
    })

}

export {
    getLocalGovernments
}