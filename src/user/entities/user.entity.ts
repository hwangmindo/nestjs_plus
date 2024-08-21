// import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Book } from 'src/book/entities/book.entity';
import { DEFAULT_CUSTOMER_POINT } from 'src/constants/point.constant';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../types/user-role.type';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  /**
   * 닉네임
   * @example "고객"
   */
  // ApiProperty: swagger open api document 를 통해
  // req body json 에 어떠한 값을 입력해야하는지 필요한 부분만 설정해주면 표기가 됨
  // @ApiProperty(): nest-cli.json 파일에서 설정한 plugins 로 인하여 불필요
  @IsNotEmpty({ message: '닉네임을 입력해 주세요.' })
  @IsString()
  @Column()
  nickname: string;

  /**
   * 이메일
   * @example "mindo0602@naver.com"
   */
  // @ApiProperty()
  @IsNotEmpty({ message: '이메일을 입력해 주세요.' })
  // IsEmail 은 {} 옵션을 먼저 주고 뒤 유효성 메세지를 추가할 수 있다.
  @IsEmail({}, { message: '이메일 형식에 맞지 않습니다.' })
  @Column({ unique: true })
  email: string;

  /**
   * 비밀번호
   * @example "Mindo0602!"
   */
  // @ApiProperty()
  @IsNotEmpty({ message: '비밀번호를 입력해 주세요.' })
  @IsStrongPassword(
    {},
    {
      message:
        '비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자(!@#$%^&*)를 포함해서 8자리 이상으로 해야 합니다.',
    },
  )
  @Column({ select: false })
  password: string;

  @IsNumber()
  @Column({ unsigned: true, default: DEFAULT_CUSTOMER_POINT })
  // unsigned 부호가 없는 정수 음수값을 가지지 않으며 0이상의 양수만 저장
  // 즉 예를 들어 -128에서 127까지의 값을 저장할 수 있다면 0에서 255까지의 값을 저장가능하게 함
  points: number;

  // @IsBoolean() true, false 라 그런지 IsBoolean으로도 잘 작동
  @IsEnum(UserRole)
  @Column({ type: 'enum', enum: UserRole, default: UserRole.Customer })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Book, (book) => book.user, { onDelete: 'CASCADE' })
  books: Book[];
}
