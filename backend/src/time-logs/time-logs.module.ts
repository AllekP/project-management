import { Module } from '@nestjs/common';
import { TimeLogsController } from './time-logs.controller';

@Module({
  controllers: [TimeLogsController],
})
export class TimeLogsModule {}
