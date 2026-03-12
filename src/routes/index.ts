import { Router } from "express"
import { UserController } from "../controllers/user.controller"
import { ProductController } from "../controllers/product.controller"

const router = Router()

const userController = new UserController()
const productController = new ProductController()

router.post("/users", userController.create)

router.post("/products", productController.create)
router.get("/products", productController.findAll)
router.get("/products/:id", productController.findById)
router.put("/products/:id", productController.update)
router.delete("/products/:id", productController.delete)

export default router