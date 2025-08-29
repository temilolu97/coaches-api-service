import { generateTransactionReference, getUserInfo, initializeBudpayPayment, verifyBudayTransaction } from "../helpers/helpers.js"
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
            reference: payment.transactionReference,
            callbackUrl: 'https://webhook.site/51b03a55-006d-4471-a43d-57aaa3a2e877'
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
                    providerReference:paymentVerification.reference,
                    providerResponse:paymentVerification
                }
            })
        }
        else{
             prisma.payment.update({
                where: {
                    transactionReference: reference
                },
                data: {
                    status: "failed",
                    providerReference:paymentVerification.reference,
                    providerResponse:paymentVerification
                }
            })
        }
    }
    catch (err) {
        console.error("Error processing webhook:", err);
    }
}

export {
    initiatePayment,
    handlePaymentHook
}