import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "./auth-service";
import { LoginRequest } from "./auth-service"

export class AuthController {
  constructor(private readonly authService: AuthService) { }

  login = async (req: FastifyRequest, res: FastifyReply) => {
    const { email, password } = req.body as LoginRequest
    const { token, user } = await this.authService.Login({
      email,
      password
    })

    return res.status(200).send({
      user: user,
      access_token: token
    })
  }
}