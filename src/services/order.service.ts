import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface CreateOrderItemDTO {
  productId: string
  quantity: number
}

interface CreateOrderDTO {
  userId: string
  items: CreateOrderItemDTO[]
}

export class OrderService {
  async create({ userId, items }: CreateOrderDTO) {

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: items.map(item => item.productId)
        }
      }
    })

    const orderItems = items.map(item => {
      const product = products.find(p => p.id === item.productId)

      if (!product) {
        throw new Error(`Produto ${item.productId} não encontrado`)
      }

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price
      }
    })

    const total = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    )

    const order = await prisma.order.create({
      data: {
        userId,
        total,
        totalDiscount: 0,
        items: {
          create: orderItems
        }
      },
      include: {
        items: true
      }
    })

    return order
  }

  async findAll() {
    return prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true
      }
    })
  }

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true
      }
    })
  }
}