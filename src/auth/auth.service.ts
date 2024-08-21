import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  // module 에서 User 를 imports 하는 이유?
  // TypeOrm 의 Repository?? 내부내용 살펴봄

  async signUp(signUpDto: SignUpDto) {
    // 애초에 파라미터에서 매개변수를 받아올때 객체구조분해 할당을 할 수도 있다.
    // async signUp({nickname, email, password, passwordConfirm}: SignUpDto)
    const { nickname, email, password, passwordConfirm } = signUpDto;

    const isPasswordMatched = password === passwordConfirm;
    if (!isPasswordMatched) {
      // nest 에서 기본제공되는 커스텀 에러를 사용하여 한다.
      // BadRequestException (HTTP 상태 코드 400)
      // UnauthorizedException (HTTP 상태 코드 401)
      // ForbiddenException (HTTP 상태 코드 403)
      // NotFoundException (HTTP 상태 코드 404)
      // ConflictException (HTTP 상태 코드 409)
      // InternalServerErrorException (HTTP 상태 코드 500)
      throw new BadRequestException(
        '비밀번호와 비밀번호 확인이 서로 일치하지 않습니다.',
      );
    }

    const existedUser = await this.userRepository.findOneBy({ email });
    // findOneBy: findOne 과 다르게 단일 필드 기반 단순 검색 수행
    if (existedUser) {
      // unique 필드가 중복될 때 409가 적합하다고 판단
      throw new ConflictException('이미 가입 된 이메일 입니다.');
    }

    const hashRounds = this.configService.get<number>('PASSWORD_HASH_ROUNDS');
    const hashedPassword = bcrypt.hashSync(password, hashRounds);

    const user = await this.userRepository.save({
      nickname,
      email,
      password: hashedPassword,
    });
    // point 를 여기서 처리하지 않고 constants 를 통해 user Entity 기본값으로 설정하였는데 괜찮은건지?

    // Entity password {select: fales} 처리를 하였지만
    // 이것은 find 를 통해 불러올때 영향을 미치는 것이지
    // create 를 통해 만들어지는 것에는 영향이 없으니 아래 코드를 작성
    // delete user.password; (user 를 return 할때 사용했던 코드 지금은 필요없음)

    return this.signIn(user.id); // 회원가입 시 동시 로그인 해주기 위한 jwt 발급
  }

  async signIn(userId: number) {
    const payload = { id: userId }; //확장성을 염두한 {}???
    const accessToken = this.jwtService.sign(payload);
    // JWT 토큰을 생성
    return { accessToken };
  }

  async validateUser({ email, password }: SignInDto) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, password: true },
    });

    const isPasswordMatched = bcrypt.compareSync(
      // password 가 일치한경우 true 반환
      password,
      user?.password ?? '',
    );
    // ?: Optional chaining 연산자로 user 객체가 null, undefined인 경우 undefined를 반환
    // ?? '':Nullish 병합 연산자(Nullish Coalescing Operator)로
    // user.password 가 null, undefined일 경우 뒤에있는 문자열 ''을 반환

    if (!user || !isPasswordMatched) {
      return null;
    }

    return { id: user.id }; // jwt 토큰 발행시 사용
  }
}
