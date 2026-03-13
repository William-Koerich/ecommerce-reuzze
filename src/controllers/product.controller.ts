import { Request, Response } from "express"
import { ProductService } from "../services/product.service"

const productService = new ProductService()

export class ProductController {

  async create(req: Request, res: Response) {
  try {

    const { name, description, price, stock } = req.body

    console.log(req.file)
    console.log(req.body)

    const imageUrl = req.file
      ? `/uploads/products/${req.file.filename}`
      : null

    const product = await productService.create({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      imageUrl
    })

    return res.status(201).json(product)

  } catch (error: any) {

    return res.status(400).json({
      message: error.message
    })

  }
}

  async findAll(req: Request, res: Response) {

    const products = await productService.findAll()

    return res.json(products)
  }

  async findById(req: Request<{ id: string }>, res: Response) {
    try {

      const { id } = req.params

      const product = await productService.findById(id)

      return res.json(product)

    } catch (error: any) {

      return res.status(404).json({
        message: error.message
      })

    }
  }

  async update(req: Request<{ id: string }>, res: Response) {
    try {

      const { id } = req.params

      const product = await productService.update(id, req.body)

      return res.json(product)

    } catch (error: any) {

      return res.status(400).json({
        message: error.message
      })

    }
  }

  async delete(req: Request<{ id: string }>, res: Response) {
    try {

      const { id } = req.params

      const result = await productService.delete(id)

      return res.json(result)

    } catch (error: any) {

      return res.status(400).json({
        message: error.message
      })

    }
  }

}