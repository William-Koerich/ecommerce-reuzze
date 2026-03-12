import { Router } from "express"
import { UserController } from "../controllers/user.controller"
import { ProductController } from "../controllers/product.controller"
import { OrderController } from "../controllers/order.controller"
import { AuthController } from "../controllers/auth.controller"


const router = Router()

const userController = new UserController()
const productController = new ProductController()
const orderController = new OrderController()
const authController = new AuthController()

router.post("/login", authController.login)

router.post("/users", userController.create)

router.post("/products", productController.create)
router.get("/products", productController.findAll)
router.get("/products/:id", productController.findById)
router.put("/products/:id", productController.update)
router.delete("/products/:id", productController.delete)

router.post("/orders", orderController.create)
router.get("/orders", orderController.findAll)
router.get("/orders/:id", orderController.findById)

export default router