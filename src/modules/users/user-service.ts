import { PrismaService } from "../../database/prisma-service.js"
import { User } from "../../generated/prisma/index.js"
import { hash } from "bcrypt"

export interface UserCreateRequest {
  email: string
  password: string
}

export interface GetUserByIdRequest {
  id: string
}

export interface GetUserByIdResponse {
  user: User | null
}

interface GetUserResponse {
  user: User[]
}

interface UserCreateResponse {
  user: User
}

export interface UserUpdateRequest {
  id: string
  email: string
  password: string
}

export interface UserUpdateResponse {
  user: User
}

export interface UserDeleteRequest {
  id: string
}


export class UserService {

  constructor(private readonly prisma: PrismaService) { }

  async createUser({ email, password }: UserCreateRequest): Promise<UserCreateResponse> {
    const hashedPassword = await hash(password, 6)
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    })
    return {
      user
    }
  }


  async getUsers(): Promise<GetUserResponse> {
    const user = await this.prisma.user.findMany()
    return {
      user
    }
  }

  async getUserById({ id }: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      }
    })

    if (!user) {
      throw new Error("User not found")
    }
    return {
      user
    }
  }

  async updateUser({ id, email, password }: UserUpdateRequest): Promise<UserUpdateResponse> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { email, password }
    })
    return {
      user
    }
  }

  async deleteUser({ id }: UserDeleteRequest): Promise<void> {
    await this.prisma.user.delete({
      where: { id }
    })
  }
}



