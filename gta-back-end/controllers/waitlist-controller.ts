import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import waitlistService from "../services/waitlist-service";
import { validationResult } from "express-validator";
import { ApiError } from "../exceptions/api-error";

const prisma = new PrismaClient();

class WaitList {
  async addWaitItem(req: Request, res: Response) {
    try {
      const { email, name } = req.body;
      if (!email || !name)
        return res
          .status(400)
          .json({ message: "Email and name must be filled" });

      // Find the smallest number in the queue cell, due to the element can be deleted
      const maxQueue = await waitlistService.findMaxQueue();

      const createdRow = await prisma.waitList.create({
        data: {
          email,
          name,
          queue: maxQueue ? maxQueue + 1 : 1,
        },
      });

      res.json(createdRow).status(201);
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
      const { column = "queue", orderBy = "asc" } = req.query;
      const columnStr = column as string;

      const waitlist = await prisma.waitList.findMany({
        orderBy: {
          [columnStr]: orderBy,
        },
      });

      res.json(waitlist);
    } catch (error) {
      next(error);
    }
  }

  async searchWaitItem(req: Request, res: Response) {
    const { searchTerm } = req.params;
    const { column = "queue", orderBy = "asc" } = req.query;
    const columnStr = column as string;
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
        orderBy: { [columnStr]: orderBy },
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

  async editWaitItem(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const { id, email, name, queue } = req.body;
      const newWaitItem = Object.assign({}, { id, email, name, queue });

      const updatedItem = await waitlistService.updateWaitItem(newWaitItem);

      res.status(200).json({
        message: `Wait item with email - "${updatedItem.email}" and name - "${updatedItem.name}" was successfully update`,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new WaitList();
