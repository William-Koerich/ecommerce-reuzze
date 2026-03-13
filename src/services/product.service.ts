import { PrismaClient, Category } from "@prisma/client";
const prisma = new PrismaClient();

interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: Category;
  imageUrl: string | null;
}

interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category: Category;
  imageUrl?: string;
}

export class ProductService {
  async create(data: CreateProductDTO) {
    const product = await prisma.product.create({
      data,
    });

    return product;
  }

  async findAll(category?: Category) {
    const products = await prisma.product.findMany({
      where: category ? { category } : undefined,

      orderBy: {
        createdAt: "desc",
      },
    });

    return products;
  }

  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    return product;
  }

  async update(id: string, data: UpdateProductDTO) {
    const productExists = await prisma.product.findUnique({
      where: { id },
    });

    if (!productExists) {
      throw new Error("Produto não encontrado");
    }

    const product = await prisma.product.update({
      where: { id },
      data,
    });

    return product;
  }

  async delete(id: string) {
    const productExists = await prisma.product.findUnique({
      where: { id },
    });

    if (!productExists) {
      throw new Error("Produto não encontrado");
    }

    await prisma.product.delete({
      where: { id },
    });

    return { message: "Produto removido" };
  }
}
