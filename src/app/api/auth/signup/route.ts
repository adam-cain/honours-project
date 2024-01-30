import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { } from "next-auth"
import { validateEmail, validatePassword } from '@/lib/validation';
import  prisma from '@/lib/prisma';

const signupHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email, password, username } = req.body;

  // Validate the password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return res.status(400).json({ message: passwordValidation.errorMessage });
  }
  // Validate the email
  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
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

    // Additional session logic can be added here
    // ...

    //TODO: Send a session token to the user

    return res.status(201).json({ 
      message: 'User created successfully',
      user : {
        id: user.id,
        email: user.email,
        username: user.username,
      }});
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
}

export default signupHandler;