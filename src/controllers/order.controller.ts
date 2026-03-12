import { Request, Response } from "express"
import { OrderService } from "../services/order.service"

export class OrderController {
  async create(req: Request, res: Response) {

    const { userId, items } = req.body

    const service = new OrderService()

    try {
      const order = await service.create({
        userId,
        items
      })

      return res.status(201).json(order)

    } catch (error) {
      return res.status(400).json({
        error: (error as Error).message
      })
    }
  }

  async findAll(req: Request, res: Response) {

    const service = new OrderService()

    const orders = await service.findAll()

    return res.json(orders)
  }

  async findById(req: Request, res: Response) {

    const { id } = req.params

    const service = new OrderService()

    const order = await service.findById(Array.isArray(id) ? id[0] : id)

    if (!order) {
      return res.status(404).json({
        message: "Pedido não encontrado"
      })
    }

    return res.json(order)
  }
}