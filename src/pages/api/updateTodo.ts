import type { NextApiRequest, NextApiResponse } from 'next'

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id, task } = req.body;
    const result = await prisma.todo.update({
      where: { id: Number(id) },
      data: { task },
    });
    res.json(result);
  }