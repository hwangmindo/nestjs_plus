import { PickType } from '@nestjs/swagger';
import { Show } from '../entities/show.entity';
import { CreateScheduleDto } from './create-schedule.dto';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShowDto extends PickType(Show, [
  'title',
  'description',
  'category',
  'place',
  'price',
  'thumbnail',
]) {
  @ValidateNested()
  // @ValidateNested(): 중첩된 객체의 유효성 검사를 적용
  // 중첩된 객체란? 맨 아래 주석 참조
  @Type(() => CreateScheduleDto)
  // @Type(() => CreateScheduleDto):
  // plain 객체(평범한 객체)를 특정 클래스의 인스턴스로 변환하여(CreateScheduleDto의 인스턴스)
  // 올바른 타입으로 사용
  schedules: CreateScheduleDto[];

  /**
   * 좌석 수
   * @example 100
   */
  @IsNotEmpty({ message: '좌석 수를 입력해 주세요.' })
  @IsNumber()
  seats: number;
}

// 중첩된 객체 예시
/*
ex1: Json (중첩된 객체 형태)
{
  "name": "John Doe",
  "age": 30,
  "address": {
    "street": "123 Main St",
    "city": "Springfield"
  }
}

ex2: Json (중첩된 객체의 배열 형태)
{
  "name": "John Doe",
  "age": 30,
  "addresses": [
    {
      "street": "123 Main St",
      "city": "Springfield"
    },
    {
      "street": "456 Oak St",
      "city": "Shelbyville"
    }
  ]
}
*/
