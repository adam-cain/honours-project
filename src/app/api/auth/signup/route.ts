import bcrypt from 'bcryptjs';
import { validateEmail, validatePassword } from '@/lib/validation';
import  prisma from '@/lib/prisma';
import { NextRequest,  NextResponse } from 'next/server';

//Signup route: Creates a new user in the database
export async function POST (req: NextRequest) {

  const requestBody = await req.json();
  const { email, password, username } = requestBody;

  // Validate the password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return NextResponse.json({ message: passwordValidation.errorMessage }, { status: 400 });
  }
  // Validate the email
  if (!validateEmail(email)) {
    return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
  }

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
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

    //TODO: Send a session token to the user

    return NextResponse.json({ 
      message: 'User created successfully',
      user : {
        id: user.id,
        email: user.email,
        username: user.username,
      }});
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error });
  }
}