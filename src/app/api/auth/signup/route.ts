import bcrypt from 'bcryptjs';
import { validateEmail, validatePassword, validateUsername } from '@/lib/validation';
import  prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

//Signup route: Creates a new user in the database

interface SignupRequestBody {
  email: string;
  password: string;
  username: string;
}

export async function POST (req: Request) {
  try {
    const requestBody = await req.json() as SignupRequestBody;
    const { email, password, username } = requestBody;


    // Validate the username
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json({ message: passwordValidation.errorMessage }, { status: 400 });
    }
    // Validate the email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json({ message: emailValidation.errorMessage }, { status: 400 });
    }

    // Validate the username
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      return NextResponse.json({ message: usernameValidation.errorMessage }, { status: 400 });
    }


    // Check if the email already exists
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
    }

    //check if the username already exists
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return NextResponse.json({ message: 'Username already exists' }, { status: 400 });
    }

    
    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user in the database
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: 'User created successfully',}, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error: ' + error}, { status: 500});
  }
}