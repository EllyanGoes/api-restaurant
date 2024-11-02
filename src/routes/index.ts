import { Router } from "express"
import { tablesRoutes } from "./tables-route"

import { productsRoutes } from "./products-routes"

import { tablesSessionsRoutes } from "./tables-sessions-routes"

import { ordersRoutes } from "./order-routes"

const routes = Router()

routes.use("/tables-sessions", tablesSessionsRoutes)
routes.use("/products", productsRoutes)
routes.use("/tables", tablesRoutes)
routes.use("/orders", ordersRoutes)

export { routes }
