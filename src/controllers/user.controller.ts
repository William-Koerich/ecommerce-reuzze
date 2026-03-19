import type { Request, Response } from "express"
import { UserService } from "../services/user.service"

const userService = new UserService()

export class UserController {

  async create(req: Request, res: Response) {

    try {

      const { name, email, cnpjOrCpf, password } = req.body

      const user = await userService.create({
        name,
        email,
        cnpjOrCpf,
        password,
      })

      return res.status(201).json(user)

    } catch (error: any) {

      return res.status(400).json({
        message: error.message
      })

    }

  }

}