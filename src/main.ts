import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService); // ?? 왜 app 에서? 글로벌 설정했는데?
  const port = configService.get<number>('SERVER_PORT');

  app.setGlobalPrefix('api', { exclude: ['/health-check'] });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // transform: 자동으로 type 변경을 해줄 수 있는 옵션
      // ex: export class Dto { @IsInt() age: number; } 일경우
      // body json { "age": "25" } => { "age": 25 }
      whitelist: true,
      // whitelist: DTO 클래스에 정의되지 않은 필드는 요청 본문에서 자동으로 제거
      // ex: DTO {name,age} 만 있는데 요청이 {name,age,address} 이렇게 들어오면
      // address는 자동 제거된다음 컨트롤러에게 name,age 만 전달한다.
      forbidNonWhitelisted: true,
      // 이 옵션은 whitelist: true 로 설정시 가능하며 같이 사용하게 되면
      // whitelist 의 자동제거 기능은 작동되지 않으며 400 Bad Request 에러 발생
      // 에러 메시지에는 어떤 필드가 허용되지 않았는지에 대한 정보를 반환
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Nestjs PlusTs')
    .setDescription('Document for Nestjs PlusTs')
    .setVersion('1.0')
    // .addTag('cats') 필요없어서 제외
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }) // 헤더 값 넣기
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 새로고침 시에도 JWT 헤더 값 유지하기
      tagsSorter: 'alpha', // API 그룹 정렬을 알파벳 순으로
      operationsSorter: 'alpha', // API 그룹 내 정렬을 알파벳 순으로
    },
  });

  await app.listen(port);
}
bootstrap();
