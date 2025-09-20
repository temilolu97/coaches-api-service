import { generateLicense, generateTransactionReference, getUserInfo, initializeBudpayPayment, initializePaystackPayment, verifyBudayTransaction } from "../helpers/helpers.js"
import prisma from "../lib/prisma.js"

const initiatePayment = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await getUserInfo(userId)
        const { amount, paymentType } = req.body
        const paymentTypeInfo = await prisma.paymentType.findFirst({
            where: {
                type: paymentType
            }
        })

        if (!paymentTypeInfo) return res.status(400).json({
            message: "Invalid payment type selected"
        })
        //generate reference

        let trxRef = generateTransactionReference("nfca-oyo-dues")

        const payment = await prisma.payment.create({
            data: {
                amount,
                transactionReference: trxRef,
                paymentTypeId: paymentTypeInfo.id,
                statusId: 1
            }
        })
        const payload = {
            email: user.email,
            amount: amount.toString(),
            reference: payment.transactionReference
        }
        let initializePayment = await initializeBudpayPayment(payload)
        return res.status(200).json({
            message: "Payment initialized successfully",
            data: initializePayment.data.authorization_url
        })
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({
            message: "Unable to initiate payment at this time"
        })
    }

}

const initiatePaymentPaystack = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await getUserInfo(userId)
        const { amount, paymentType } = req.body
        const paymentTypeInfo = await prisma.paymentType.findFirst({
            where: {
                type: paymentType
            }
        })

        if (!paymentTypeInfo) return res.status(400).json({
            message: "Invalid payment type selected"
        })
        //generate reference

        let trxRef = generateTransactionReference("nfca-oyo-dues")

        const payment = await prisma.payment.create({
            data: {
                amount,
                transactionReference: trxRef,
                paymentTypeId: paymentTypeInfo.id,
                statusId: 1,
                userId: userId
            }
        })
        const payload = {
            email: user.email,
            amount: (amount * 100).toString(),
        }
        let initializePayment = await initializePaystackPayment(payload)
        const updatedPayment = await prisma.payment.update({
            where: {
                id: payment.id
            },
            data: {
                providerReference: initializePayment.data.reference
            }
        })
        return res.status(200).json({
            message: "Payment initialized successfully",
            data: initializePayment.data
        })
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({
            message: "Unable to initiate payment at this time"
        })
    }

}

const handlePaymentHook = async (req, res) => {
    res.sendStatus(200)
    try {


        const { notify, notifyType, data } = req.body
        const { reference } = data
        const payment = await prisma.payment.findFirst({
            where: {
                transactionReference: reference
            }
        })
        if (notifyType.toLowerCase() == "successful") {
            const paymentVerification = await verifyBudayTransaction(reference)
            if (
                payment.amount !== paymentVerification.amount ||
                payment.currency !== paymentVerification.currency
            ) {
                console.error("Mismatch on webhook for:", reference);
                return;
            }
            prisma.payment.update({
                where: {
                    transactionReference: reference
                },
                data: {
                    status: paymentVerification.status,
                    providerReference: paymentVerification.reference,
                    providerResponse: paymentVerification
                }
            })
        }
        else {
            prisma.payment.update({
                where: {
                    transactionReference: reference
                },
                data: {
                    status: "failed",
                    providerReference: paymentVerification.reference,
                    providerResponse: paymentVerification
                }
            })
        }
    }
    catch (err) {
        console.error("Error processing webhook:", err);
    }
}

const receivePaystackHook = async (req, res) => {
    const event = req.body;
    res.status(200).json({ message: 'Hook received' });
    handlePaystackHook(event);
}

const handlePaystackHook = async (payload) => {
    try {
        const payment = await prisma.payment.findFirst({
            where: {
                providerReference: payload.data.reference
            }
        })
        if (!payment) {
            console.error("Payment not found for reference:", payload.data.reference);
            return;
        }

        // Helper to update payment in one place
        const updatePayment = async (data) => {
            await prisma.payment.update({
                where: { id: payment.id },
                data: {
                    ...data
                }
            });
        };
        if (payload.data.amount / 100 !== payment.amount) {
            return await updatePayment({
                remarks: "Invalid amount",
                Status: "Failed"
            });
        }
        if (payload.data.currency !== payment.currency) {
            return await updatePayment({
                remarks: "Invalid currency",
                Status: "Failed"
            });
        }
         await updatePayment({
            remarks:payload.data.message ??"",
            responseMessage:payload.data.gateway_response,
            Status: payload.data.status === "success" ? "Successful" : payload.data.status
        });
        await generateLicense(payment.userId)
    }
    catch (err) {
        console.error("Error processing paystack webhook:", err);
    }
}

export {
    initiatePayment,
    initiatePaymentPaystack,
    handlePaymentHook,
    receivePaystackHook
}