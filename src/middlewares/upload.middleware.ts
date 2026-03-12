import multer from "multer"
import path from "path"
import crypto from "crypto"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products")
  },
  filename: (req, file, cb) => {

    const hash = crypto.randomBytes(10).toString("hex")

    const fileName = `${hash}-${file.originalname}`

    cb(null, fileName)
  }
})

export const upload = multer({
  storage
})