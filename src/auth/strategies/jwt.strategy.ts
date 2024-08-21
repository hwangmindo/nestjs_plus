import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    // readonly 는 사용하면 안되는것인가?
    super({
      // jwtFromRequest : 어디서 jwt를 가져올 것이냐
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ignoreExpiration: false (default 가 false 라 필요없음),(true 로 설정시 만료시간 무시 토큰 검증)
      secretOrKey: configService.get<string>('JWT_SECRET'),
      // verify() 할때 위 시크릿키를 사용하겠다 라는 의미
    });
  }

  // payload에는 verify() 과정을 거쳐 디코딩된 값이 들어가게끔 할 것이다.
  async validate(payload: JwtPayload) {
    return payload; // req.user (?? 생각해보니 req.user 에 누가 담아주는거지? )
  }
}
