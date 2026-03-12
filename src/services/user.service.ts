import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

interface CreateUserDTO {
  name: string
  email: string
  cnpjOrCpf: string
  password: string

  address: {
    street: string
    number: string
    complement?: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export class UserService {

  async create({ name, email, cnpjOrCpf, password, address }: CreateUserDTO) {

    return prisma.$transaction(async (tx) => {

      const userExists = await tx.user.findFirst({
        where: {
          OR: [
            { email },
            { cnpjOrCpf }
          ]
        }
      })

      if (userExists) {
        throw new Error("Usuário já cadastrado")
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      // 1️⃣ cria usuário
      const user = await tx.user.create({
        data: {
          name,
          email,
          cnpjOrCpf,
          password: hashedPassword
        }
      })

      // 2️⃣ cria endereço
      const addressCreated = await tx.address.create({
        data: {
          userId: user.id,
          street: address.street,
          number: address.number,
          complement: address.complement,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country
        }
      })

      const { password: _, ...userWithoutPassword } = user

      return {
        ...userWithoutPassword,
        address: addressCreated
      }

    })

  }

}