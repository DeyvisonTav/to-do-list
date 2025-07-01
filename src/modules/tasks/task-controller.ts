import { FastifyRequest, FastifyReply } from "fastify"
import { TaskCreateRequest, TaskService } from "./task-service"

export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  createTask = async (req: FastifyRequest, res: FastifyReply) => {
    const data = req.body as TaskCreateRequest
    const task = await this.taskService.createTask(data)
    return res.status(201).send(task)
  }
}