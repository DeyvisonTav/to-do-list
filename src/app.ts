import { fastify } from "fastify";
import { userRoutes } from "./modules/users/user-routes";
import { taskRoutes } from "./modules/tasks/task-routes";

export const app = fastify()
app.register(userRoutes)
app.register(taskRoutes)


