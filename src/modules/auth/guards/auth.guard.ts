import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/entities/user.entity";

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly em: EntityManager
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      'isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const token = 
      req.cookies?.accessToken ||
      req.headers?.authorization?.split(' ')[1];

    if (!token) throw new UnauthorizedException('No token provided');
    
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (e){
      console.log(req.headers?.authorization?.split(' ')[1])
      console.error(e);
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.em.findOne(User, { userId: payload.sub });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    req.user = user;
    return true;
  }
}