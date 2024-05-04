// import type { NextApiRequest, NextApiResponse } from 'next'

// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient()

// export default async function handle(req: NextApiRequest, res: NextApiResponse) {
//   const { task } = req.body;
//   const result = await prisma.todo.create({
//     data: {
//       task,
//     },
//   });
//   res.json(result);
// }


// pages/api/createTodo.ts
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
  const { task } = req.body;

  const result = await prisma.todo.create({
    data: {
      task,
      userId: Number(userId), // Assign userId directly here
    },
  });
  res.json(result);
}