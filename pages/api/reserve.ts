import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // Create this file

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { username, prankId } = req.body;

    // Check if username is taken
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) return res.status(400).json({ error: "Username taken" });

    // Create new user
    const user = await prisma.user.create({ data: { username, prankId } });

    res.status(201).json({ success: true, link: `/${user.username}` });
  }
}
