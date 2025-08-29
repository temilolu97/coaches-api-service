import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import { generateToken } from "../middlewares/authMiddleware.js";
const registerCoach = async (req, res) => {
    const { firstName, lastName, email, mobileNumber, password, state, localGovernment } = req.body;

    const requiredFields = { firstName, lastName, mobileNumber, password, state, localGovernment };

    // Find missing fields
    const missingFields = Object.entries(requiredFields)
        .filter(([key, value]) => !value || value.toString().trim() === '')
        .map(([key]) => key);

    if (missingFields.length > 0) {
        return res.status(400).json({
            status: 'failed',
            message: `${missingFields.join(', ')} ${missingFields.length > 1 ? 'are' : 'is'} required`,
        });
    }
    //check if phone or email already exists
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { mobileNumber: mobileNumber.trim() },
                { email: email ? email.trim() : null }
            ]
        }
    });
    if (existingUser) {
        return res.status(400).json({
            status: 'failed',
            message: 'User with this mobile number or email already exists'
        });
    }
    const encryptedPassword = bcrypt.hashSync(password.trim(), 10);
    const newUser = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email ? email.trim() : null,
        mobileNumber: mobileNumber.trim(),
        password: encryptedPassword,
        state: state.trim(),
        localGovernment: localGovernment ? localGovernment.trim() : null,
        userTypeId: 2,
        isActive: false
    }
    const user = await prisma.user.create({
        data: newUser
    })
    if (!user) {
        return res.status(500).json({
            status: 'failed',
            message: 'An error occurred while creating the user'
        });
    }
    return res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        data: {
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                emailAddress: user.email,
                mobileNumber: user.mobileNumber,
                state: user.state,
                localGovernment: user.localGovernment,
                isActive: user.isActive,
            }
        }
    });

}

const login = async (req, res) => {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
        return res.status(400).json({
            status: 'failed',
            message: 'Identifier and password are required'
        });
    }
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: identifier.trim() },
                { mobileNumber: identifier.trim() }
            ]
        }
    });
    if (!user) {
        return res.status(404).json({
            status: 'failed',
            message: 'User not found. Please check your credentials or cretate an account'
        });
    }
    const isPasswordValid = bcrypt.compareSync(password.trim(), user.password);
    if (!isPasswordValid) {
        return res.status(401).json({
            status: 'failed',
            message: 'Incorrect password'
        });
    }
    let token = generateToken(user);

    return res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                emailAddress: user.email,
                mobileNumber: user.mobileNumber,
                state: user.state,
                localGovernment: user.localGovernment,
                isActive: user.isActive,
                accessToken: token
            }
        }
    });
}

const getProfile =async(req,res)=>{
    
    const userId = req.user.id
    let user = await prisma.user.findFirst({
        where:{id:userId},
        omit:{password:true},
        include:{userType:true}
    })
    return res.status(200).json({
        message:"Profile retrieved successfully",
        data:user    
    })

}

export {
    registerCoach,
    login,
    getProfile
}