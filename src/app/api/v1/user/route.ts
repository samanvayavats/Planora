import { NextRequest, NextResponse } from "next/server";
import { UserRegisterSchema, UserRegisterType } from "@/schema/v1/user/user.schema";
import { registerUser, getAlltheProjectForTheUser } from "@/services/user/user.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          message: " Not authenticated",
        },
        { status: 401 },
      );
    }

    const projects = await getAlltheProjectForTheUser(session.user.id);

    if (!projects) {
      return NextResponse.json(
        {
          message: " No project found for this user",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message: "Projects fetched Successfully",
        data: projects,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("No project found ");
    return NextResponse.json(
      {
        message: " No project found for this user",
      },
      { status: 500 },
    );
  }
}
