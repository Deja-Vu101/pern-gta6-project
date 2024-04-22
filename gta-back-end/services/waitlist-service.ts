import { PrismaClient } from "@prisma/client";
import { ApiError } from "../exceptions/api-error";
import { IWaitItem } from "../interfaces";

const prisma = new PrismaClient();

class WaitlistService {
  async deleteWaitItem(id: number) {
    const existItem = await prisma.waitList.findFirst({
      where: {
        id: id,
      },
    });

    if (!existItem) throw ApiError.BadRequest("This wait item is not exist");

    const deleteItem = await prisma.waitList.delete({
      where: {
        id: id,
      },
    });

    return deleteItem;
  }

  async updateQueue(deletedQueueItem: number) {
    const updateQueue = await prisma.waitList.updateMany({
      where: {
        queue: {
          gt: deletedQueueItem,
        },
      },
      data: {
        queue: {
          decrement: 1,
        },
      },
    });
    return updateQueue;
  }

  async findMaxQueue() {
    const foundItem = await prisma.waitList.findMany({
      select: {
        queue: true,
      },
    });

    const minQueue = Math.max(...foundItem.map((i) => i.queue));

    return minQueue;
  }

  async updateWaitItem(newObject: IWaitItem) {
    const existItem = await prisma.waitList.findFirst({
      where: {
        id: newObject.id,
      },
    });

    if (!existItem) throw ApiError.BadRequest("This wait item is not exist");

    const isEqualObjects =
      JSON.stringify(newObject) === JSON.stringify(existItem);

    if (isEqualObjects)
      throw ApiError.NotModified(
        `Wait item with email - "${existItem.email}" and name - "${existItem.name}" has already updated`
      );

    const duplicateEmailItem = await prisma.waitList.findFirst({
      where: {
        id: { not: newObject.id },
        email: newObject.email,
      },
    });

    const duplicateQueueItem = await prisma.waitList.findFirst({
      where: {
        id: { not: newObject.id },
        queue: newObject.queue,
      },
    });

    if (duplicateEmailItem && duplicateQueueItem) {
      throw ApiError.BadRequest(
        `This email "${newObject.email}" and queue "${newObject.queue}" already exist`,
        ["email", "queue"]
      );
    } else if (duplicateEmailItem) {
      throw ApiError.BadRequest(
        `This email "${newObject.email}" already exists`,
        ["email"]
      );
    } else if (duplicateQueueItem) {
      throw ApiError.BadRequest(
        `This queue "${newObject.queue}" already exists`,
        ["queue"]
      );
    }

    const updatedItem = await prisma.waitList.update({
      where: {
        id: existItem.id,
      },
      data: {
        email: newObject.email,
        id: newObject.id,
        name: newObject.name,
        queue: newObject.queue,
      },
    });
    return updatedItem;
  }
}

export default new WaitlistService();
