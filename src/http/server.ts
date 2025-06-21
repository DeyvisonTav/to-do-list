import { fastify } from "fastify";
import { z } from "zod";
import { PrismaClient } from "../generated/prisma/index.js"
import { hash } from "bcrypt";

const prisma = new PrismaClient()
const server = fastify()


server.get("/", () => {
  return {
    hello: "world"
  }
})

server.post("/users", async (request, reply) => {
  const createUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = createUserSchema.parse(request.body)

  const passwordHash = await hash(password, 6)

  const userCreated = await prisma.user.create({
    data: {
      email: email,
      password: passwordHash,
    }
  })

  return reply.status(201).send({
    id: userCreated.id,
    message: "User created successfully",
  })
})

server.get("/users", async (request, reply) => {
  const users = await prisma.user.findMany()
  return reply.status(200).send(users.map(user => ({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  })))
})

server.delete("/users/:id", async (request, reply) => {
  const userDeleteSchema = z.object({
    id: z.string(),
  })
  const { id } = userDeleteSchema.parse(request.params)

  await prisma.user.delete({
    where: {
      id: id,
    }
  })
  return reply.status(200).send({
    message: "User deleted successfully",
  })
})

server.listen({
  port: 3333,
}).then(() => {
  console.log("Server is running on port 3333")
})
