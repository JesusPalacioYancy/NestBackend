import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private authService: AuthService
  ) {};


  async canActivate(context: ExecutionContext,): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) { throw new UnauthorizedException('there is no bearer token' ); };
    
    try{
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        { secret: process.env.JWT_SEED }
      );

      const user = await this.authService.findUserById(payload.id);

      if (!user ) throw new UnauthorizedException('user not exist'); 
      // if ( !user.isActive ) throw new UnauthorizedException('this user is inactive');

      request['user'] = user;
      
    } catch(err) {
      if ( err instanceof UnauthorizedException ) {
        throw err;
      } else {
        throw new UnauthorizedException('Invalid or expired token');
      }
    };

    return Promise.resolve(true);
  };

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  };


};