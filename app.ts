import express from "express"
import routes from "./src/routes/index"
import cors from "cors"
import path from "path"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/uploads", express.static(path.resolve("uploads")))

app.use("/api", routes)

export default app