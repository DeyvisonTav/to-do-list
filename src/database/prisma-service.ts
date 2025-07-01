import { PrismaClient } from '../generated/prisma/index.js';

export class PrismaService extends PrismaClient {

  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error']
    })
  }

  async onModuleInit() {
    await this.$connect();
  }
}