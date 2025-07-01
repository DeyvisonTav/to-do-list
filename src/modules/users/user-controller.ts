import { GetUserByIdRequest, UserService } from "./user-service.js";
import { FastifyRequest, FastifyReply } from "fastify";
import { UserCreateRequest } from "./user-service.js";

export class UserController {
  constructor(private readonly userService: UserService) { }

  createUser = async (req: FastifyRequest, res: FastifyReply) => {
    const { email, password } = req.body as UserCreateRequest

    const user = await this.userService.createUser({
      email,
      password
    })

    return res.status(201).send(user)
  }

  getUsers = async (_: FastifyRequest, res: FastifyReply) => {
    const users = await this.userService.getUsers()
    return res.status(200).send(users)
  }

  getUserById = async (req: FastifyRequest, res: FastifyReply) => {
    const { id } = req.params as GetUserByIdRequest
    const user = await this.userService.getUserById({ id })

    if (!user) {
      return res.status(404).send({ message: "User not found" })
    }

    return res.status(200).send(user)

  }
}
