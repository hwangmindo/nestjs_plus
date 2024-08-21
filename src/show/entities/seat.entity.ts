import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity({
  name: 'seats',
})
export class Seat {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ unsigned: true })
  scheduleId: number;

  @Column({ unsigned: true })
  availableSeats: number;

  @Column({ unsigned: true })
  totalSeats: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // join컬럼으로 인해 필요 없는 것인가?? { onDelete: 'CASCADE' } 답변 : 빼먹은것 같다
  // 아무리 OneToOne 이라해도 어차피 자동으로 scheduleId 랑 연동이 될텐데 join이 꼭필요한 것인가?
  @OneToOne(() => Schedule, (schedule) => schedule.seat)
  @JoinColumn()
  // 답변: OneToOne은 종속관계 인식을 위해 필수적으로 필요함
  // ManyToOne,OneToMany 같은경우는 종속관계를 자동으로 인식 Many 쪽 테이블이 One을 바라보는 id 자동생성 ex: schedule_id
  schedule: Schedule;
}
