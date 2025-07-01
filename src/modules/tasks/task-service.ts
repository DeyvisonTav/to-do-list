import { PrismaService } from "../../database/prisma-service"
import { Tasks } from "../../generated/prisma/index.js"

export interface TaskCreateRequest {
  title: string
  description: string
  userId: string
}

interface TaskCreateResponse {
  task: Tasks
}

export class TaskService {
  constructor(private readonly prisma: PrismaService) { }

  async createTask(data: TaskCreateRequest): Promise<TaskCreateResponse> {
    const task = await this.prisma.tasks.create({
      data
    })
    return {
      task
    }
  }
}