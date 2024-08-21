import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SignInDto } from './dtos/sign-in.dto';

@ApiTags('인증') // swagger open api document 에서 관련된 태그들만 모아서 표출하고 싶을때 사용하는 데코레이터
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 회원가입
   * @param signUpDto
   * @returns
   */
  // rest 클라이언트 파일 생성 완료
  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const data = await this.authService.signUp(signUpDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: '회원가입에 성공했습니다.',
      data,
    };
  }

  /**
   * 로그인
   * @param req
   * @param signInDto
   * @returns
   */
  @HttpCode(HttpStatus.OK) // @Post() 데코레이터 사용시 기본 응담 상태코드가 201 Created 로 설정됨으로 변경
  @UseGuards(AuthGuard('local'))
  @Post('/sign-in')
  async signIn(@Request() req, @Body() signInDto: SignInDto) {
    const data = await this.authService.signIn(req.user.id);

    return {
      statusCode: HttpStatus.OK,
      message: '로그인에 성공했습니다.',
      data,
    };
  }
}
