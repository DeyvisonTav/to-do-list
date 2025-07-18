import { GetUserByIdRequest, UserService } from "./user-service.js";
import { FastifyRequest, FastifyReply } from "fastify";
import { UserCreateRequest, UserUpdateRequest, UserDeleteRequest } from "./user-service";
import { Guard } from "../guard/guard"
import { JwtService } from "../auth/jwt-service.js";

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

  getUsers = async (req: FastifyRequest, res: FastifyReply) => {
    const guard = new Guard(req, res, new JwtService(process.env.SECRET_KEY as string))
    const isAuthenticated = await guard.canActivate()
    if (!isAuthenticated) {
      return res.status(401).send({ message: "Unauthorized" })
    }
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

  updateUser = async (req: FastifyRequest, res: FastifyReply) => {
    const { id } = req.params as UserUpdateRequest
    const { email, password } = req.body as UserUpdateRequest
    const user = await this.userService.updateUser({ id, email, password })
    return res.status(200).send(user)
  }

  deleteUser = async (req: FastifyRequest, res: FastifyReply) => {
    const { id } = req.params as UserDeleteRequest
    await this.userService.deleteUser({ id })
    return res.status(204).send()
  }
}
