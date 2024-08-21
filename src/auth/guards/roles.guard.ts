import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from 'src/user/types/user-role.type';
import { JwtAuthGuard } from './jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable() // 상당히 어렵 입구 출구가 안느껴지는 코드.
// AuthGuard('jwt') 는 이미 implements CanActivate 를 하고있다.
export class RolesGuard extends JwtAuthGuard {
  @InjectRepository(User) private readonly userRepository: Repository<User>;
  // 부모클래스에서 인젝션 해야하는 번거로움 또는 구현하지 않아도 되게끔 constructor 가 아닌
  // property-based injection (전체적인 이해도 부족...클래스 관계 정리 필요)
  constructor(private reflector: Reflector) {
    super();
  } // reflector 를 사용하여 데코레이터 role 을 가져온다.

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authenticated = await super.canActivate(context);

    if (!authenticated) {
      throw new UnauthorizedException('인증 정보가 잘못되었습니다.');
    }

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const userId = req.user.id;
    const user = await this.userRepository.findOneBy({ id: userId });

    const hasPermission = requiredRoles.some((role) => role === user.role);

    if (!hasPermission) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    return true;
  }
}
