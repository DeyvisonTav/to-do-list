import { JwtService as JwtServiceInterface } from "@nestjs/jwt"

export class JwtService extends JwtServiceInterface {
  constructor(secret: string) {
    super({
      secret: process.env.SECRET_KEY ?? secret,
      signOptions: {
        expiresIn: '1d',
      },
    });
  }
}
