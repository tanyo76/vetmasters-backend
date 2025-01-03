import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerInit } from './utils/swagger/swaggerInit';

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  swaggerInit(app);

  await app.listen(process.env.PORT);
}
bootstrap();
