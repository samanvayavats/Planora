import { UserRegisterType } from "@/schema/v1/user/user.schema";
import { prisma } from "@/lib/prisma";
import bcrypt, { genSaltSync } from "bcryptjs";

export async function registerUser(user: UserRegisterType) {
  const { name, email, password } = user;
  const hashPassword = await bcrypt.hash(password, genSaltSync(10));

  const isUserExits = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (isUserExits) {
    throw new Error("User exits with this email");
  }

  const userRegister = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return userRegister;
}
