// pages/api/signup.ts
// pages/api/signup.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: "User with this email already exists" });
    } else {
      const user = await prisma.user.create({
        data: {
          email,
          password,
        },
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '8h' }
      );

      // Send token in the response
      res.status(200).json({ user, token });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while creating the user." });
  }
}