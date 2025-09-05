import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const oyoStateLGAs = [
  "Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda",
  "Ibadan North", "Ibadan North-East", "Ibadan North-West",
  "Ibadan South-East", "Ibadan South-West", "Ibarapa Central",
  "Ibarapa East", "Ibarapa North", "Ido", "Irepo", "Iseyin",
  "Itesiwaju", "Iwajowa", "Kajola", "Lagelu", "Ogbomosho North",
  "Ogbomosho South", "Ogo Oluwa", "Olorunsogo", "Oluyole", "Ona Ara",
  "Orelope", "Ori Ire", "Oyo East", "Oyo West", "Saki East",
  "Saki West", "Surulere"
];

async function main() {
  try {
    // Seed LGAs
    for (const name of oyoStateLGAs) {
      await prisma.localGovernment.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    }

    // Seed Admin user (using upsert)
    await prisma.user.upsert({
      where: { email: "admin@gmail.com" },
      update: {},
      create: {
        firstName: "Admin",
        lastName: "Administrator",
        email: "admin@gmail.com",
        mobileNumber: "1234567890",
        password: bcrypt.hashSync("P@55word", 10),
        state: "Oyo",
        localGovernment: "Ibadan North", 
        userTypeId: 1,
      },
    });

    // Seed Payment Statuses
    await prisma.paymentStatus.createMany({
      data: [
        { status: "Initiated" },
        { status: "Pending" },
        { status: "Successful" },
        { status: "Failed" },
      ],
      skipDuplicates: true, // prevents duplicate insertion
    });

    console.log("✅ Seeding completed successfully");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
