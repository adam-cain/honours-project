import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { } from "next-auth"

const prisma = new PrismaClient();

const signupHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, password, username } = req.body;
    
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

    return res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
}

export { signupHandler as POST }