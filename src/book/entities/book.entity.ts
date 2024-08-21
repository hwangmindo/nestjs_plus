import { IsNotEmpty, IsNumber } from 'class-validator';
import { Schedule } from 'src/show/entities/schedule.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'books',
})
export class Book {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ unsigned: true })
  userId: number;

  /**
   * 공연회차 ID
   * @example 1
   */
  @IsNumber()
  @IsNotEmpty({ message: '공연회차 ID를 입력해 주세요.' })
  @Column({ unsigned: true })
  scheduleId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @ManyToOne(() => User, (user) => user.books)
  user: User;

  // schedule에서 예매내역을 볼 필요는 없으니까 위 처럼 반대되는 설정은 하지 않는다.
  @ManyToOne(() => Schedule, { onDelete: 'CASCADE' })
  schedule: Schedule;
}
