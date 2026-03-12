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

    return prisma.$transaction(async (tx) => {

      // 1️⃣ validar usuário
      const user = await tx.user.findUnique({
        where: { id: userId }
      })

      if (!user) {
        throw new Error("Usuário não encontrado")
      }

      // 2️⃣ buscar produtos de uma vez (performance)
      const productIds = items.map(item => item.productId)

      const products = await tx.product.findMany({
        where: {
          id: {
            in: productIds
          }
        }
      })

      if (products.length !== items.length) {
        throw new Error("Um ou mais produtos não existem")
      }

      // 3️⃣ validar estoque + montar itens
      const orderItems = items.map(item => {

        const product = products.find(p => p.id === item.productId)!

        if (product.stock < item.quantity) {
          throw new Error(`Estoque insuficiente para ${product.name}`)
        }

        return {
          productId: product.id,
          quantity: item.quantity,
          price: product.price
        }
      })

      // 4️⃣ calcular total
      const total = orderItems.reduce((acc, item) => {
        return acc + item.price * item.quantity
      }, 0)

      // 5️⃣ cálculo de desconto (exemplo simples)
      let totalDiscount = 0

      if (total > 500) {
        totalDiscount = total * 0.10
      }

      const finalTotal = total - totalDiscount

      // 6️⃣ criar pedido
      const order = await tx.order.create({
        data: {
          userId,
          total: finalTotal,
          totalDiscount,
          items: {
            create: orderItems
          }
        },
        include: {
          items: true
        }
      })

      // 7️⃣ atualizar estoque
      for (const item of orderItems) {

        const product = products.find(p => p.id === item.productId)!

        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: product.stock - item.quantity
          }
        })

      }

      return order
    })
  }

  async findAll() {

    return prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

  }

  async findById(id: string) {

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!order) {
      throw new Error("Pedido não encontrado")
    }

    return order
  }

}