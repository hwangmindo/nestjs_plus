import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateShowDto } from './dtos/create-show.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Show } from './entities/show.entity';
import { Like, Repository } from 'typeorm';
import { FindAllShowDto } from './dtos/find-all-show.dto';

@Injectable()
export class ShowService {
  constructor(
    @InjectRepository(Show) private readonly showRepository: Repository<Show>,
  ) {}

  async create(createShowDto: CreateShowDto) {
    const { schedules, seats, ...restOfShow } = createShowDto; // 레스트 연산자 사용

    const existedShow = await this.showRepository.findOneBy({
      title: createShowDto.title,
    });

    if (existedShow) {
      throw new ConflictException('이미 사용 중인 공연명입니다.');
    }

    const show = await this.showRepository.save({
      ...restOfShow,
      schedules: schedules.map((schedule) => {
        return {
          ...schedule,
          seat: {
            availableSeats: seats,
            totalSeats: seats,
          },
        };
      }),
    });
    // 새롭게 만들어지는 show 와 연결된 schedules를 만드는 것이기 때문에 showId 까지 자동으로 넣어준다.
    // @OneToMany(() => Schedule, (schedule) => schedule.show, { cascade: true })

    return show;
  }

  async findAll({ keyword, category }: FindAllShowDto) {
    const shows = await this.showRepository.find({
      where: {
        ...(keyword && { title: Like(`%${keyword}%`) }),
        ...(category && { category }),
      },
    });
    return shows;
  }

  async findOne(id: number) {
    const show = await this.showRepository.findOne({
      where: { id },
      relations: {
        schedules: {
          seat: true,
        },
      },
    });

    if (!show) {
      throw new NotFoundException('공연을 찾을 수 없습니다.');
    }

    return show;
  }
}
