import connecting from "../../../../lib/db";
import User from "../../../../lib/model/user";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY;

export async function POST(req) {
    await connecting();

    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required!' }, { status: 400 });
        }

        const existingUser = await User.findOne({ mail: email });

        if (!existingUser) {
            return NextResponse.json({ message: 'User not found!' }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid credentials!' }, { status: 401 });
        }

        // Generate JWT Token
            const token = jwt.sign({ email, username: existingUser.user , phone:existingUser.phone ,role:existingUser.role}, SECRET_KEY, { expiresIn: '2d' });

            
            const response = NextResponse.json({ message: 'Login successful!' }, { status: 200 });
            response.cookies.set({
                name: 'authToken',
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 2 * 24 * 60 * 60,
                path: '/',
            });

        return response;

    } catch (error) {
        return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 500 });
    }
}
