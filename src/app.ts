import { fastify } from "fastify";
import { userRoutes } from "./modules/users/user-routes";
import { taskRoutes } from "./modules/tasks/task-routes";
import { authRoutes } from "./modules/auth/auth-routes";
import cors from "@fastify/cors"

export const app = fastify()
app.register(userRoutes)
app.register(taskRoutes)
app.register(authRoutes)
app.register(cors, {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
})


