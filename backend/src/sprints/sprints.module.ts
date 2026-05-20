import { Module } from '@nestjs/common';
import { SprintsController } from './sprints.controller';

@Module({
  controllers: [SprintsController],
})
export class SprintsModule {}
