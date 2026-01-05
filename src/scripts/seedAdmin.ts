import { UserRole } from "../lib/middleware/authMiddleware";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
  try {
    const userData = {
      name: "Zisan Nissan",
      email: "zisan@gmail.com",
      password: "admin12309",
      role: UserRole.ADMIN,
    };

    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      console.log("✅ Admin already exists");
      return;
    }

    const response = await fetch("http://localhost:3000/api/auth/sign-up/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
         "Origin": "http://localhost:3000", // 👈 REQUIRED
      },
      body: JSON.stringify(userData),
    });
    if (response.ok) {
      await prisma.user.update({
          where: { email: userData.email },
          data: { emailVerified: true },
      })
    }
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const createdUser = await response.json();
    console.log("✅ Admin created:", createdUser);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
