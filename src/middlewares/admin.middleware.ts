import { Request, Response, NextFunction } from "express"

export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {

  if (req.userRole !== "ADMIN") {

    return res.status(403).json({
      message: "Acesso permitido apenas para administradores"
    })

  }

  return next()

}