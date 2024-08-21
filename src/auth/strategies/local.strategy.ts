import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  // Strategy 기본은 local 이며 변경하고 싶을시 아래처럼
  // export class LocalStrategy extends PassportStrategy(Strategy, 'local2')
  constructor(private readonly authService: AuthService) {
    // 상속을 받았기 때문에 passportStrategy구문 클래스의 constructor를 super() 로 불러줘야한다.
    super({
      // passport-local Strategy 의 기본값이 username, password 이기때문에 아래와 같이 해줘야함.
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser({ email, password });

    if (!user) {
      throw new UnauthorizedException('일치하는 인증 정보가 없습니다.');
    }
    return user;
  }
}
