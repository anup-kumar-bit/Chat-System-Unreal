import connecting from "../../../../lib/db";
import User from "../../../../lib/model/user";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export async function POST(request) {
    await connecting();
    try {
        const body = await request.json();
        const { email, name, phone, role, password } = body;

        if (!email || !name || !phone || !role || !password) {
            return NextResponse.json({ message: 'All fields are required!' }, { status: 400 });
        }

        const existingUser = await User.findOne({ mail: email });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists!' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            user: name,
            mail: email,
            phone,
            role,
            password: hashedPassword,
        });

        await newUser.save();
        return NextResponse.json({ message: 'User registered successfully!' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Something went wrong', error: error.message }, { status: 500 });
    }
}
