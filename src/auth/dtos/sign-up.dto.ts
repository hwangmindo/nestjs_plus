// import { PickType } from '@nestjs/mapped-types';
// PickType 을 swagger 를 통하여 open api 에 나타내고자 하면 mapped-types 이 아닌 아래처럼
// import { ApiProperty, PickType } from '@nestjs/swagger'; plugins 로 인해 ApiProperty 불필요
import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class SignUpDto extends PickType(User, [
  'email',
  'password',
  'nickname',
]) {
  /**
   * 비밀번호 확인
   * @example "Mindo0602!"
   */
  // @ApiProperty({ example: 'Mindo0602!'}) 이렇게 설정하여 예시를 직관적으로 표기가능
  @IsNotEmpty({ message: '비밀번호 확인을 입력해 주세요.' })
  // IsPasswordMatching 커스텀 데코레이터 필요
  @IsStrongPassword(
    {},
    {
      message:
        '비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자(!@#$%^&*)를 포함해서 8자리 이상으로 해야 합니다.',
    },
  )
  passwordConfirm: string;
}
