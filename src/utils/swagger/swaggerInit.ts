import { NestApplication } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

enum NODE_ENV {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}
export function swaggerInit(app: NestApplication) {
  if (process.env.NODE_ENV !== NODE_ENV.DEVELOPMENT) {
    return;
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle('VetMasters')
    .setDescription('The VetMasters API')
    .setVersion('1.0')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/swagger', app, documentFactory);
}
