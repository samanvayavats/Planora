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
          message: "Validation failed , Please enter the right inputs",
          errors: userValidation.error.flatten(),
        },
        { status: 400 },
      );
    }

    const user = await registerUser(userValidation.data);

    if (!user) {
      return NextResponse.json(
        {
          message: "Registration Failed , try again later",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "User Registered  Successfully",
      data: user,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        message: ` Registration Failed ${error instanceof Error ? error.message : ""}`,
      },
      { status: 500 },
    );
  }
}
