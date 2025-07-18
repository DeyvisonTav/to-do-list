import { FastifyInstance } from "fastify"
import { TaskController } from "./task-controller"
import { TaskService } from "./task-service"
import { PrismaService } from "../../database/prisma-service"

export function taskRoutes(app: FastifyInstance) {
  const prismaService = new PrismaService()
  const taskService = new TaskService(prismaService)
  const taskController = new TaskController(taskService)

  app.post("/tasks", taskController.createTask)
  app.get("/tasks", taskController.getTasks)
  app.get("/tasks/:id", taskController.getTaskById)
  app.put("/tasks/:id", taskController.updateTask)
  app.delete("/tasks/:id", taskController.deleteTask)
  app.get("/tasks/user/:userId", taskController.getTasksByUserId)
  app.get("/tasks/status/:status", taskController.getTasksByStatus)
}