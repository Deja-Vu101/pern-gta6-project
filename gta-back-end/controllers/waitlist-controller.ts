import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import waitlistService from "../services/waitlist-service";

const prisma = new PrismaClient();

class WaitList {
  async addWaitItem(req: Request, res: Response) {
    const { email, name } = req.body;
    if (!email || !name)
      return res.status(400).json({ message: "Email and name must be filled" });
    try {
      // Find the smallest number in the queue cell, due to the element can be deleted
      const maxQueue = await waitlistService.findMaxQueue();

      const createdRow = await prisma.waitList.create({
        data: {
          email,
          name,
          queue: maxQueue + 1,
        },
      });

      res.json(createdRow);
    } catch (error: any) {
      if (error.code === "P2002") {
        res.status(400).send({ message: "Email already exists" });
      }
      console.error("Error creating new row:", error);
      res.status(400).send({ message: error });
    }
  }

  async fetchWaitList(req: Request, res: Response, next: NextFunction) {
    try {
      const waitlist = await prisma.waitList.findMany({
        orderBy: {
          queue: "asc",
        },
      });

      res.json(waitlist);
    } catch (error) {
      next(error);
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

  async deleteWaitItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body;

      const deletedItem = await waitlistService.deleteWaitItem(id);

      const updateQueue = await waitlistService.updateQueue(deletedItem.queue);

      res.status(200).json({
        message: `Wait item with email - "${deletedItem.email}" and name - "${deletedItem.name}" was successfully deleted`,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new WaitList();
