import axios from "axios";
import prisma from "../lib/prisma.js";

export const validateEmail = (email) => {
    try {
        email = email.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    catch (err) {
        throw err
    }
}

const generateTransactionReference = (prefix) => {
    const randomNumber = Date.now()
    return `${prefix}${randomNumber}`
}

const initializeBudpayPayment = async (payload) => {
    try {
        const response = await axios.post('https://api.budpay.com/api/v2/transaction/initialize', payload, {
            headers: {
                Authorization: `Bearer ${process.env.BUDPAY_SECRET}`,
                "Content-Type": "application/json"
            }
        })
        return response.data
    }
    catch (err) {
        throw err
    }
}

const verifyBudayTransaction = async (reference) => {
    try {
        const response = await axios.get(`https://api.budpay.com/api/v2/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.BUDPAY_SECRET}`
            }
        })
        console.log(response.data);
        
        return response.data
    }
    catch (err) {
        throw err
    }
}
const getUserInfo = async (userId) => {
    try {
        const userInfo = await prisma.user.findFirstOrThrow({
            where: {
                id: userId
            }
        })
        return userInfo
    }
    catch (err) {
        throw err
    }
}

export {
    generateTransactionReference,
    initializeBudpayPayment,
    getUserInfo,
    verifyBudayTransaction
}