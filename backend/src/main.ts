import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(cookieParser());

  app.enableCors({
    origin:'https://event-mang-sys-ems-12323211.netlify.app',
    credentials:true
  })
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
