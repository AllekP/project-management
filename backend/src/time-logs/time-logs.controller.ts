import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('time-logs')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('time-logs')
export class TimeLogsController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async create(@Body() data: any, @Request() req: any) {
    return this.prisma.timeLog.create({
      data: {
        duration: data.duration, // in seconds
        startTime: new Date(data.startTime),
        endTime: data.endTime ? new Date(data.endTime) : null,
        issueId: data.issueId,
        userId: req.user.id,
        description: data.description,
      }
    });
  }

  @Post('sync')
  async sync(@Body() data: any[], @Request() req: any) {
    // For CLI batch syncing
    const logs = data.map(log => ({
      duration: log.duration,
      startTime: new Date(log.startTime),
      endTime: log.endTime ? new Date(log.endTime) : null,
      issueId: log.issueId,
      userId: req.user.id,
      description: log.description,
    }));

    return this.prisma.timeLog.createMany({
      data: logs
    });
  }
}
