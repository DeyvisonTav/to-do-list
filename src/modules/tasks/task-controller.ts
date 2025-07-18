import { FastifyRequest, FastifyReply } from "fastify"
import { TaskCreateRequest, TaskGetByUserIdRequest, TaskService, TaskUpdateRequest } from "./task-service"
import { Guard } from "../guard/guard"
import { JwtService } from "../auth/jwt-service"
import { TaskStatus } from "../../generated/prisma/index.js"

interface TaskGetByIdRequest {
  id: string
}

interface TaskGetByStatusRequest {
  status: TaskStatus
}

export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  private async authenticateRequest(req: FastifyRequest, res: FastifyReply): Promise<boolean> {
    const guard = new Guard(req, res, new JwtService(process.env.SECRET_KEY as string))
    const isAuthenticated = await guard.canActivate()
    if (!isAuthenticated) {
      res.status(401).send({ message: "Unauthorized" })
      return false
    }
    return true
  }

  createTask = async (req: FastifyRequest, res: FastifyReply) => {
    const isAuthenticated = await this.authenticateRequest(req, res)
    if (!isAuthenticated) return

    const data = req.body as TaskCreateRequest
    const task = await this.taskService.createTask(data)
    return res.status(201).send(task)
  }

  getTasks = async (req: FastifyRequest, res: FastifyReply) => {
    const isAuthenticated = await this.authenticateRequest(req, res)
    if (!isAuthenticated) return

    const tasks = await this.taskService.getTasks()
    return res.status(200).send(tasks)
  }

  getTaskById = async (req: FastifyRequest, res: FastifyReply) => {
    const isAuthenticated = await this.authenticateRequest(req, res)
    if (!isAuthenticated) return

    const { id } = req.params as TaskGetByIdRequest
    const task = await this.taskService.getTaskById(id)
    return res.status(200).send(task)
  }

  updateTask = async (req: FastifyRequest, res: FastifyReply) => {
    const isAuthenticated = await this.authenticateRequest(req, res)
    if (!isAuthenticated) return

    const { id } = req.params as TaskGetByIdRequest
    const data = req.body as TaskUpdateRequest
    const task = await this.taskService.updateTask(id, data)
    return res.status(200).send(task)
  }

  deleteTask = async (req: FastifyRequest, res: FastifyReply) => {
    const isAuthenticated = await this.authenticateRequest(req, res)
    if (!isAuthenticated) return

    const { id } = req.params as TaskGetByIdRequest
    await this.taskService.deleteTask(id)
    return res.status(204).send()
  }

  getTasksByUserId = async (req: FastifyRequest, res: FastifyReply) => {
    const isAuthenticated = await this.authenticateRequest(req, res)
    if (!isAuthenticated) return

    const { userId } = req.params as TaskGetByUserIdRequest
    const tasks = await this.taskService.getTasksByUserId({ userId })
    return res.status(200).send(tasks)
  }

  getTasksByStatus = async (req: FastifyRequest, res: FastifyReply) => {
    const isAuthenticated = await this.authenticateRequest(req, res)
    if (!isAuthenticated) return

    const { status } = req.params as TaskGetByStatusRequest
    const tasks = await this.taskService.getTasksByStatus(status)
    return res.status(200).send(tasks)
  }
}