import { Request, Response, NextFunction } from "express"
import { AppError } from "@/utils/AppError"
import { knex } from "@/database/knex"
import { z } from "zod"

class OrdersControllers {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        tables_session_id: z.number(),
        product_id: z.number(),
        quantity: z.number(),
      })

      const { tables_session_id, product_id, quantity } = bodySchema.parse(
        request.body
      )

      const session = await knex<TablesSessionsRepository>("tables_sessions")
        .where({ id: tables_session_id })
        .first()

      if (!session) {
        throw new AppError("table session not found")
      }

      if (session.closed_at) {
        throw new AppError("this table is closed")
      }

      const product = await knex<ProductRepository>("products")
        .where({
          id: product_id,
        })
        .first()

      if (!product) {
        throw new AppError("product not found")
      }

      await knex<OrderRepository>("orders").insert({
        tables_session_id,
        product_id,
        quantity,
        price: product.price,
      })

      return response.status(201).json()
    } catch (error) {
      next(error)
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const { tables_session_id } = request.params
      const order = await knex("orders")
        .select(
          "orders.id",
          "orders.tables_session_id",
          "orders.product_id",
          "products.name",
          "orders.quantity",
          "orders.price",
          knex.raw("(orders.price * orders.quantity) AS total"),
          "orders.created_at",
          "orders.updated_at"
        )
        .join("products", "products.id", "orders.product_id")
        .where({ tables_session_id })
        .orderBy("orders.created_at")

      return response.json(order)
    } catch (error) {
      next(error)
    }
  }

  async show(request: Request, response: Response, next: NextFunction) {
    try {
      const { tables_session_id } = request.params

      const order = await knex("orders")
        .select(
          knex.raw("COALESCE(SUM(orders.price * orders.quantity),0) AS total"),
          knex.raw("COALESCE(SUM(orders.quantity),0) AS quantity")
        )
        .where({ tables_session_id })
        .first()

      return response.json(order)
    } catch (error) {
      next(error)
    }
  }
}

export { OrdersControllers }
