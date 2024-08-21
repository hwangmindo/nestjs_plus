import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  healthCheck(): string {
    // 3000 포트 오류 및 sever-port undefined 표시됨 3020포트 설정후 정상작동??
    return `This ${this.configService.get<number>('SERVER_PORT')}port server is healthy `;
  }
}
