import { NextApiRequest, NextApiResponse } from 'next';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.body;
  const result = await prisma.todo.delete({
    where: { id: Number(id) },
  });
  res.json(result);
}