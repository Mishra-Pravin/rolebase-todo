// import type { NextApiRequest, NextApiResponse } from 'next'
// // import prisma from '../../lib/prisma';
// import { PrismaClient } from '@prisma/client';

// // import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()

// // export default prisma
// export default async function handle(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'GET') {
//     const todos = await prisma.todo.findMany();
//     res.json(todos);
//   } else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }


// pages/api/getTodos.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Not authorized' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const { id: userId } = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;

  if (req.method === 'GET') {
    const todos = await prisma.todo.findMany({
      where: { 
        userId: Number(userId)
      },
    });
    res.json(todos);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
