import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

class WaitList {
  async addWaitItem(req: Request, res: Response) {
    const { email, name } = req.body;
    if (!email || !name)
      return res.status(400).json({ message: "Email and name must be filled" });
    try {
      const createRow = await prisma.waitList.create({
        data: {
          email,
          name,
        },
      });

      console.log(createRow);

      const newRow = await prisma.waitList.findUnique({
        where: { id: createRow.id },
      });

      res.json(newRow);
    } catch (error: any) {
      if (error.code === "P2002") {
        res.status(400).send({ message: "Email already exists" });
      }
      console.error("Error creating new row:", error);
      res.status(400).send({ message: error });
    }
  }

  async fetchWaitList(req: Request, res: Response) {
    try {
      const waitlist = await prisma.waitList.findMany();
      res.json(waitlist);
    } catch (error) {
      res.status(400).send({ message: error });
    }
  }

  async searchWaitItem(req: Request, res: Response) {
    const { searchTerm } = req.params;

    try {
      const searchedItems = await prisma.waitList.findMany({
        where: {
          OR: [
            {
              email: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              queue: {
                equals: parseInt(searchTerm) || undefined,
              },
            },
          ],
        },
      });

      if (searchedItems.length === 0)
        return res.status(400).send({ message: "Items Not Found" });

      res.json(searchedItems);
    } catch (error) {
      res.status(400).send({ message: error });
    }
  }
}

export default new WaitList();
