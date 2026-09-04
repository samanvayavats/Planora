import { NextRequest, NextResponse } from "next/server";
import { UserRegisterSchema, UserRegisterType } from "@/schema/v1/user/user.schema";
import { registerUser } from "@/services/user/user.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const userValidation = UserRegisterSchema.safeParse(body);

    if (!userValidation.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: userValidation.error.flatten(),
        },
        { status: 400 },
      );
    }

    const user = await registerUser(userValidation.data);

    if (!user) {
      return NextResponse.json(
        {
          message: "Registration Failed",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "User Registered  Successfully",
      data: user,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Registration Failed",
      },
      { status: 500 },
    );
  }
}
