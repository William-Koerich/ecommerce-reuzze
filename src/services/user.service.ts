import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

interface CreateUserDTO {
  name: string
  email: string
  cnpjOrCpf: string
  password: string
}

export class UserService {

  async create({ name, email, cnpjOrCpf, password }: CreateUserDTO) {

    const userExists = await prisma.user.findFirst({
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

    const user = await prisma.user.create({
      data: {
        name,
        email,
        cnpjOrCpf,
        password: hashedPassword
      }
    })

    const { password: _, ...userWithoutPassword } = user

    return userWithoutPassword
  }

}