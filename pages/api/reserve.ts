import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { username, prankId } = req.body;

    // Validate the input data
    if (typeof username !== "string" || typeof prankId !== "string") {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Check if username is already taken
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username taken" });
    }

    // Create new user with prankId as string
    const user = await prisma.user.create({
      data: { username, prankId }, // prankId is a string in the Prisma schema
    });

    // Respond with the created user and a link to their prank page
    res.status(201).json({ success: true, link: `/${user.username}` });
  } else {
    // Handle invalid HTTP methods
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
