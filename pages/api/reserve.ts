import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { username, prankId } = req.body;

    // Validate input data
    if (typeof username !== "string" || typeof prankId !== "string") {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Check if the prank exists
    const prank = await prisma.prank.findUnique({ where: { id: prankId } });
    if (!prank) {
      return res.status(404).json({ error: "Prank not found" });
    }

    // Check if username is already taken
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username taken" });
    }

    // Create new user and associate it with the prankId
    const user = await prisma.user.create({
      data: {
        username,
        prankId, // Reference to the prank
      },
    });

    // Respond with the created user and a link to their prank page
    res.status(201).json({ success: true, link: `/${user.username}` });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
