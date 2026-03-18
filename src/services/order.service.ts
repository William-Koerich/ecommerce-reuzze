import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateOrderItemDTO {
  productId: string;
  quantity: number;
}

interface CreateOrderDTO {
  userId?: string; // opcional
  items: CreateOrderItemDTO[];

  companyName: string;
  buyerName: string;
  cnpj: string;
  whatsapp: string;
  deliveryAddress: string;
}

export class OrderService {
  async create({
    userId,
    items,
    companyName,
    buyerName,
    cnpj,
    whatsapp,
    deliveryAddress,
  }: CreateOrderDTO) {
    return prisma.$transaction(async (tx) => {
      // ❌ REMOVE validação obrigatória de user
      let user = null;

      if (userId) {
        user = await tx.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          throw new Error("Usuário não encontrado");
        }
      }

      // produtos
      const productIds = items.map((item) => item.productId);

      const products = await tx.product.findMany({
        where: {
          id: { in: productIds },
        },
      });

      if (products.length !== items.length) {
        throw new Error("Um ou mais produtos não existem");
      }

      // itens
      const orderItems = items.map((item) => {
        const product = products.find((p) => p.id === item.productId)!;

        if (product.stock < item.quantity) {
          throw new Error(`Estoque insuficiente para ${product.name}`);
        }

        return {
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        };
      });

      // total
      const total = orderItems.reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0);

      // criação
      const order = await tx.order.create({
        data: {
          userId: userId ?? null,

          companyName,
          buyerName,
          cnpj,
          whatsapp,
          deliveryAddress,

          total,
          totalDiscount: 0,

          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
        },
      });

      // estoque
      for (const item of orderItems) {
        const product = products.find((p) => p.id === item.productId)!;

        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: product.stock - item.quantity,
          },
        });
      }

      return order;
    });
  }

  async findAll() {
    return prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    return order;
  }
}
