import { Module } from '@nestjs/common';
import { ShowService } from './show.service';
import { ShowController } from './show.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';
import { Schedule } from './entities/schedule.entity';
import { Seat } from './entities/seat.entity';
import { User } from 'src/user/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Show, Schedule, Seat]), AuthModule],
  // TypeOrmModule 에 User 를  않아 오류발생 User 넣기 또는
  // AuthModule 에서 export 한 TypeOrmodule 의 User를 AuthModule로 넣어주기
  // 장단점??
  controllers: [ShowController],
  providers: [ShowService],
})
export class ShowModule {}
