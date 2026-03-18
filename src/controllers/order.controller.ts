import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { sendOrderMail } from "../services/mail.service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

type OrderItemRequest = {
  productId: string;
  quantity: number;
};

type OrderItemWithData = {
  name: string;
  quantity: number;
  price: number;
};

export class OrderController {
  async create(req: Request, res: Response) {
    const {
      userId,
      items,
      companyName,
      buyerName,
      cnpj,
      whatsapp,
      deliveryAddress,
    }: {
      userId: string;
      items: OrderItemRequest[];
      companyName: string;
      buyerName: string;
      cnpj: string;
      whatsapp: string;
      deliveryAddress?: string;
    } = req.body;

    const service = new OrderService();

    try {
      const order = await service.create({
        userId,
        items,
        companyName,
        buyerName,
        cnpj,
        whatsapp,
        deliveryAddress: deliveryAddress || "",
      });

      // ✅ tipado corretamente
      const itemsWithData: OrderItemWithData[] = await Promise.all(
        items.map(async (item: OrderItemRequest) => {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
          });

          return {
            name: product?.name || "Produto",
            quantity: item.quantity,
            price: product?.price || 0,
          };
        })
      );

      // ✅ usa os itens corretos
      await sendOrderMail({
        companyName,
        buyerName,
        cnpj,
        whatsapp,
        items: itemsWithData,
      });

      return res.status(201).json(order);
    } catch (error) {
      return res.status(400).json({
        error: (error as Error).message,
      });
    }
  }

  async findAll(req: Request, res: Response) {
    const service = new OrderService();
    const orders = await service.findAll();

    return res.json(orders);
  }

  async findById(req: Request, res: Response) {
    const { id } = req.params;
    const service = new OrderService();

    try {
      const order = await service.findById(id as string);
      return res.json(order);
    } catch (error) {
      return res.status(404).json({
        error: (error as Error).message,
      });
    }
  }
}