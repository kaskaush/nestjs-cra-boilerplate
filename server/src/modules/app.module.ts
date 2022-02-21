import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import PostsModule from './posts.module';
import * as ormconfig from '../config/orm.config';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/default.config';
import APILoggerMiddleware from '../middleware/api-logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot(ormconfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../', 'client', 'build'),
      serveRoot: '/app',
      exclude: ['/api*'],
    }),
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(APILoggerMiddleware).exclude('app').forRoutes('*');
  }
}
