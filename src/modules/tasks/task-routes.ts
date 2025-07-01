import { FastifyInstance } from "fastify"
import { TaskController } from "./task-controller"
import { TaskService } from "./task-service"
import { PrismaService } from "../../database/prisma-service"

export function taskRoutes(app: FastifyInstance) {
  const prismaService = new PrismaService()
  const taskService = new TaskService(prismaService)
  const taskController = new TaskController(taskService)

  app.post("/tasks", taskController.createTask)
}