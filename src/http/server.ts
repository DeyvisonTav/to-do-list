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


server.post("/users", async (req, res) => {

  const { email, password } = req.body as { email: string, password: string }

  await prisma.user.create({
    data: {
      email,
      password,
    }
  })

  return res.status(201).send({
    message: "user created successfully",
  })
})

server.get("/user/:id", async (request, reply) => {
  const userGetSchema = z.object({
    id: z.string(),
  })

  const { id } = userGetSchema.parse(request.params)

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    }
  })

  if (!user) {
    return reply.status(404).send({
      message: "User not found",
    })
  }

  return reply.status(200).send({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  })

})

server.get("/users", async (_, reply) => {
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

server.put("/users/:id", async (req, res) => {
  const userUpdateSchemaPamams = z.object({
    id: z.string(),
  })

  const userUpdateSchemaBody = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  const { id } = userUpdateSchemaPamams.parse(req.params)
  const { email, password } = userUpdateSchemaBody.parse(req.body)

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    }
  })

  if (!user) {
    return res.status(404).send({
      message: "User not found",
    })
  }

  const hashedPassword = await hash(password, 6)

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      email: email,
      password: hashedPassword,
    }
  })

  return res.status(200).send({
    message: "User updated successfully",
  })
})

server.post("/tasks", async (req, res) => {
  const tasksSchema = z.object({
    userId: z.string(),
    title: z.string(),
    description: z.string(),
  })

  const { userId, title, description } = tasksSchema.parse(req.body)

  const task = await prisma.tasks.create({
    data: {
      title: title,
      description: description,
      userId: userId,
    }
  })

  return res.status(201).send({
    id: task.id,
    message: "Task created successfully",
  })
})


server.listen({
  port: 3333,
}).then(() => {
  console.log("Server is running on port 3333")
})
