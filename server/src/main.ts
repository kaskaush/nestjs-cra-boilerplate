import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import NotFoundExceptionFilter from './filters/NotFoundExceptionFilter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import Logger from './utils/Logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  });
  app.setGlobalPrefix('api');

  app.enableCors();

  app.useGlobalFilters(new NotFoundExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Reddit Clone')
    .setDescription('Reddit clone API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
