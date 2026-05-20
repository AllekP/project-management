import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('reports')
export class ReportsController {
  constructor(private prisma: PrismaService) {}

  @Get('time-and-cost')
  async getTimeAndCost(@Request() req: any, @Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    const where: any = {
      user: {
        organizationId: req.user.organizationId
      }
    };

    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) where.startTime.gte = new Date(startDate);
      if (endDate) where.startTime.lte = new Date(endDate);
    }

    const timeLogs = await this.prisma.timeLog.findMany({
      where,
      include: {
        issue: {
          include: {
            project: true
          }
        },
        user: true
      }
    });

    // Grouping logic
    const projectStats: Record<string, { name: string, totalSeconds: number, totalCost: number }> = {};
    const userStats: Record<string, { name: string, totalSeconds: number }> = {};

    timeLogs.forEach(log => {
      const project = log.issue?.project;
      const projectName = project?.name || 'Unassigned';
      const projectId = project?.id || 'unassigned';

      if (!projectStats[projectId]) {
        projectStats[projectId] = { name: projectName, totalSeconds: 0, totalCost: 0 };
      }
      projectStats[projectId].totalSeconds += log.duration;

      const hourlyRate = Number(project?.hourlyRate) || 0;
      projectStats[projectId].totalCost += (log.duration / 3600) * hourlyRate;

      const userName = `${log.user.firstName || ''} ${log.user.lastName || ''}`.trim() || log.user.email;
      if (!userStats[log.userId]) {
        userStats[log.userId] = { name: userName, totalSeconds: 0 };
      }
      userStats[log.userId].totalSeconds += log.duration;
    });

    return {
      projectStats: Object.values(projectStats),
      userStats: Object.values(userStats),
      totalSeconds: timeLogs.reduce((acc, log) => acc + log.duration, 0),
      totalCost: Object.values(projectStats).reduce((acc, p) => acc + p.totalCost, 0)
    };
  }
}
