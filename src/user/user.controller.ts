import {
  Controller,
  Get,
  Request,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('사용자')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 내 정보 조회
   * @param req
   * @returns
   */
  @ApiBearerAuth() // swagger 사용시 Authorize 저장된소스를 사용할 곳에 데코레이터 지정
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async findMe(@Request() req) {
    const userId = req.user.id;

    const data = await this.userService.findOneById(userId);
    return {
      statusCode: HttpStatus.OK,
      massage: '내 정보 조회에 성공했습니다.',
      data,
    };
  }
}
