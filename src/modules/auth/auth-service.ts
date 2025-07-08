import { PrismaService } from "../../database/prisma-service"
import { User } from "../../generated/prisma/index.js"
import { JwtService } from "./jwt-service"
import { compare } from "bcrypt"

export interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  user: User
  token: string
}

export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ) { }

  async Login({ email, password }: LoginRequest): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!user) {
      throw new Error("user not found")
    }

    const matchPassword = await compare(password, user.password)

    if (!matchPassword) {
      throw new Error("user not found")
    }

    const payload = {
      sub: user.id,
      email: user.email
    }

    const token = this.jwt.sign(payload, {
      expiresIn: "1d"
    })

    return {
      user,
      token
    }

  }
}

