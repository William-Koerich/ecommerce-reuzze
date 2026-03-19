import { Router } from "express"
import { UserController } from "../controllers/user.controller"
import { ProductController } from "../controllers/product.controller"
import { OrderController } from "../controllers/order.controller"
import { AuthController } from "../controllers/auth.controller"
import { upload } from "../middlewares/upload.middleware"
import multer from "multer"
import path from "path"

// Configuração do multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/products/") // pasta onde as imagens serão salvas
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})
const file = multer({ storage })


const router = Router()

const userController = new UserController()
const productController = new ProductController()
const orderController = new OrderController()
const authController = new AuthController()

router.post("/login", authController.login)

router.post("/users", userController.create)


// router.post("/products", productController.create)
router.get("/products", productController.findAll)
router.get("/products/:id", productController.findById)
router.put("/products/:id", productController.update)
router.delete("/products/:id", productController.delete)
router.post("/products",file.single("image"),productController.create)




router.post("/orders", orderController.create)
router.get("/orders", orderController.findAll)
router.get("/orders/:id", orderController.findById)
router.patch("/orders/:id", orderController.update)

export default router