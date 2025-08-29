import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.user.create({
            data: {
                firstName: "Admin",
                lastName: "Administrator",
                email: "admin@gmail.com",
                mobileNumber: "1234567890",
                password: bcrypt.hashSync("P@55word", 10),
                state: "Oyo",
                localGovernment: "Ibadan",
                userTypeId: 1
            }
        });

        await prisma.paymentStatus.createMany({
            data: [
                { status: "Initiated" },
                { status: "Pending" },
                { status: "Completed" },
                { status: "Failed" }
            ]
        });
    } catch (error) {
        console.error("Error during seeding:", error);
    }
}

main().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});