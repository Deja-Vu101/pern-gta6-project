import { PrismaClient } from "@prisma/client";
import { ApiError } from "../exceptions/api-error";

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
}

export default new WaitlistService();
