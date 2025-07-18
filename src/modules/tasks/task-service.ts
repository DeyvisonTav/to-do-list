import { PrismaService } from "../../database/prisma-service"
import { Tasks, TaskStatus } from "../../generated/prisma/index.js"

export interface TaskCreateRequest {
  title: string
  description: string
  userId: string
  status?: TaskStatus
}

export interface TaskCreateResponse {
  task: Tasks
}

export interface TaskGetResponse {
  tasks: Tasks[]
}

interface TaskGetByIdResponse {
  task: Tasks
}

export interface TaskUpdateRequest {
  id: string
  title?: string
  description?: string
  status?: TaskStatus
}

export interface TaskUpdateResponse {
  task: Tasks
}

export interface TaskGetByUserIdRequest {
  userId: string
}

export interface TaskGetByUserIdResponse {
  tasks: Tasks[]
}

export class TaskService {
  constructor(private readonly prisma: PrismaService) { }

  private validateTaskStatus(status?: TaskStatus): TaskStatus {
    if (status && !Object.values(TaskStatus).includes(status)) {
      throw new Error(`Status inválido. Valores permitidos: ${Object.values(TaskStatus).join(', ')}`)
    }
    return status || TaskStatus.IN_PROGRESS
  }

  async createTask(data: TaskCreateRequest): Promise<TaskCreateResponse> {
    const validatedStatus = this.validateTaskStatus(data.status)

    const task = await this.prisma.tasks.create({
      data: {
        ...data,
        status: validatedStatus
      }
    })
    return {
      task
    }
  }

  async getTasks(): Promise<TaskGetResponse> {
    const tasks = await this.prisma.tasks.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return {
      tasks
    }
  }

  async getTaskById(id: string): Promise<TaskGetByIdResponse> {
    const task = await this.prisma.tasks.findUniqueOrThrow({
      where: { id }
    })
    return {
      task
    }
  }

  async updateTask(id: string, data: TaskUpdateRequest): Promise<TaskUpdateResponse> {
    const { id: _, ...updateData } = data

    // Validar status se fornecido
    if (updateData.status) {
      updateData.status = this.validateTaskStatus(updateData.status)
    }

    const task = await this.prisma.tasks.update({
      where: { id },
      data: updateData
    })
    return {
      task
    }
  }

  async deleteTask(id: string): Promise<void> {
    await this.prisma.tasks.delete({
      where: { id }
    })
  }

  async getTasksByUserId({ userId }: TaskGetByUserIdRequest): Promise<TaskGetByUserIdResponse> {
    const tasks = await this.prisma.tasks.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
    return {
      tasks
    }
  }

  async getTasksByStatus(status: TaskStatus): Promise<TaskGetResponse> {
    const tasks = await this.prisma.tasks.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' }
    })
    return {
      tasks
    }
  }
}