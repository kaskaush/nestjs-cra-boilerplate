import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import NotFoundExceptionFilter from './filters/not-found-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import Logger from './utils/logger.util';

const BACKEND_PORT = 3001;

async function bootstrap() {
  const logger = new Logger('main');
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

  await app.listen(BACKEND_PORT, () =>
    logger.log(`Started NestJS application on port ${BACKEND_PORT}`),
  );
}
bootstrap();
