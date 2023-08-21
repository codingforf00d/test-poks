import { Module } from '@nestjs/common';
import { Gateway } from './app.gateway';

@Module({
  imports: [Gateway]
})
export class AppModule {}
