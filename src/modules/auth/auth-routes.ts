import { FastifyInstance } from "fastify";
import { AuthController } from "./auth-controller";
import { PrismaService } from "../../database/prisma-service";
import { AuthService } from "./auth-service";
import { JwtService } from "./jwt-service";

export function authRoutes(app: FastifyInstance) {

  const jwtService = new JwtService("my_secret")
  const prismaService = new PrismaService()
  const authService = new AuthService(prismaService, jwtService)
  const authController = new AuthController(authService)

  app.post("/login", authController.login)
}