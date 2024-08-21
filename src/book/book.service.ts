import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dtos/create-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { User } from 'src/user/entities/user.entity';
import { Seat } from 'src/show/entities/seat.entity';
import { Schedule } from 'src/show/entities/schedule.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class BookService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    // @InjectRepository(User) private readonly UserRepository: Repository<User>,
    // @InjectRepository(Seat) private readonly SeatRepository: Repository<Seat>,
    // @InjectRepository(Schedule)
    // private readonly scheduleRepository: Repository<Schedule>,
  ) {}
  async create(userId: number, { scheduleId }: CreateBookDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 공연 회차정보 조회
      const schedule = await queryRunner.manager.findOne(Schedule, {
        where: { id: scheduleId },
        relations: {
          show: true,
        },
      });

      if (!schedule) {
        throw new NotFoundException('공연 회차 정보가 없습니다.');
      }

      // 예매 내역 생성
      const book = await queryRunner.manager.save(Book, {
        userId,
        scheduleId,
      });

      // 플러스주차 과제 해설 20. 예매하기 APi 기본 13:45 이해가잘 안되는???
      // 포인트 차감 => show 가격 정보
      const price = schedule.show.price;
      const user = await queryRunner.manager.findOneBy(User, { id: userId });

      const afterPaidPoints = user.points - price;
      if (afterPaidPoints < 0) {
        throw new BadRequestException('포인트가 부족합니다.');
      }

      await queryRunner.manager.save(User, {
        id: userId,
        points: afterPaidPoints,
      });

      // 좌석 개수 줄이기
      const seat = await queryRunner.manager.findOneBy(Seat, { scheduleId });
      const afterBookedSeats = seat.availableSeats - 1;
      if (afterBookedSeats < 0) {
        throw new BadRequestException('예매 가능한 좌석이 없습니다.');
      }

      await queryRunner.manager.save(Seat, {
        id: seat.id,
        availableSeats: afterBookedSeats,
      });

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return book;
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      console.error(err);
      throw err;
    }
  }

  async findAll(userId: number) {
    const books = await this.bookRepository.find({
      where: { userId },
      relations: {
        schedule: {
          show: true,
        },
      },
    });

    return books;
  }

  async findOne(id: number, userId: number) {
    const book = await this.bookRepository.findOne({
      where: { id, userId },
      relations: {
        schedule: {
          show: true,
        },
      },
    });

    if (!book) {
      throw new NotFoundException('예매 정보를 찾을 수 없습니다.');
    }

    return book;
  }
}

/*
async create(userId: number, { scheduleId }: CreateBookDto) {
  // 공연 회차정보 조회
  const schedule = await this.scheduleRepository.findOne({
    where: { id: scheduleId },
    relations: {
      show: true,
    },
  });

  if (!schedule) {
    throw new NotFoundException('공연 회차 정보가 없습니다.');
  }

  // 예매 내역 생성
  const book = await this.bookRepository.save({
    userId,
    scheduleId,
  });

  // 플러스주차 과제 해설 20. 예매하기 APi 기본 13:45 이해가잘 안되는???
  // 포인트 차감 => show 가격 정보
  const price = schedule.show.price;
  const user = await this.UserRepository.findOneBy({ id: userId });
  await this.UserRepository.save({ id: userId, points: user.points - price });

  // 좌석 개수 줄이기
  const seat = await this.SeatRepository.findOneBy({ scheduleId });
  await this.SeatRepository.save({
    id: seat.id,
    availableSeats: seat.availableSeats - 1,
  });

  return book;
}
*/
