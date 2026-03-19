import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { Category } from "@prisma/client";

const productService = new ProductService();

export class ProductController {
  async create(req: Request, res: Response) {
    try {
      const { name, description, price, stock, category } = req.body;

      const imageUrl = req.file
        ? `uploads/products/${req.file.filename}`
        : null;

      const product = await productService.create({
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category: category as Category,
        imageUrl,
      });

      return res.status(201).json(product);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async findAll(req: Request, res: Response) {
    const { category } = req.query;

    const products = await productService.findAll(
      category as Category | undefined,
    );

    return res.json(products);
  }

  async findById(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;

      const product = await productService.findById(id);

      return res.json(product);
    } catch (error: any) {
      return res.status(404).json({
        message: error.message,
      });
    }
  }

  async update(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;

      const product = await productService.update(id, req.body);

      return res.json(product);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  async delete(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;

      const result = await productService.delete(id);

      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }
}
