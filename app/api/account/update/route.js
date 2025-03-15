import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connecting from "../../../../lib/db";
import User from "../../../../lib/model/user";

const SECRET_KEY = process.env.SECRET_KEY;

export async function PUT(req) {
  await connecting();

  try {
    const body = await req.json();
    const { username, phone, role, email } = body;

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    console.log("Updating user with email:", email);
    console.log("Data to update:", { username, phone, role });

    const updatedUser = await User.findOneAndUpdate(
      { mail: email },
      { user:username, phone, role },
      { new: true }
    );

    if (!updatedUser) {
      console.log("User not found with email:", email);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generate new JWT token with updated user data
    const token = jwt.sign(
      { email: updatedUser.mail, username: updatedUser.user, phone: updatedUser.phone, role: updatedUser.role },
      SECRET_KEY,
      { expiresIn: "2d" }
    );

    // Set HTTP-only Cookie with new Token
    const response = NextResponse.json({ message: "Account updated successfully!", user: updatedUser }, { status: 200 });
    response.cookies.set({
      name: "authToken",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json({ message: "Something went wrong", error: error.message }, { status: 500 });
  }
}
