import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Gateway } from './app.gateway';

@Module({
  imports: [Gateway],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
