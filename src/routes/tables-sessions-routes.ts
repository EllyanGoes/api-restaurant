import { Router } from "express"

import { TablesSessionsController } from "@/controllers/tables-sessions-controllers"

const tablesSessionsRoutes = Router()
const tablesSessionsController = new TablesSessionsController()

tablesSessionsRoutes.post("/", tablesSessionsController.create)
tablesSessionsRoutes.get("/", tablesSessionsController.index)

tablesSessionsRoutes.patch("/:id", tablesSessionsController.update)

export { tablesSessionsRoutes }
