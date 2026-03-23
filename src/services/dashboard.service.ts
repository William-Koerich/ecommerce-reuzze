import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class DashboardService {

  async getMetrics() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    const totalRevenue = orders.reduce(
      (acc, order) => acc + order.total,
      0
    );

    const totalOrders = orders.length;

    const averageTicket =
      totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      revenue: totalRevenue,
      orders: totalOrders,
      averageTicket,
    };
  }

  async getSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ordersToday = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    const revenueToday = ordersToday.reduce(
      (acc, order) => acc + order.total,
      0
    );

    const productsCount = await prisma.product.count();

    const lowStock = await prisma.product.count({
      where: {
        stock: {
          lte: 5,
        },
      },
    });

    return {
      ordersToday: ordersToday.length,
      revenueToday,
      productsCount,
      lowStock,
    };
  }

  async getRecentOrders() {
    return prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}