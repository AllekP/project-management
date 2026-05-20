import { Controller, Get, Post, Body, Param, Put, UseGuards, Request, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateSprintDto } from './dto/create-sprint.dto';

@ApiTags('sprints')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('sprints')
export class SprintsController {
  constructor(private prisma: PrismaService) {}

  @Get('project/:projectId')
  @ApiOperation({ summary: 'List all sprints for a project' })
  async findByProject(@Param('projectId') projectId: string, @Request() req: any) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { client: true }
    });

    if (!project || project.client.organizationId !== req.user.organizationId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.sprint.findMany({
      where: { projectId },
      include: { _count: { select: { issues: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new sprint' })
  async create(@Body() data: CreateSprintDto, @Request() req: any) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: data.projectId,
        client: { organizationId: req.user.organizationId }
      }
    });
    if (!project) throw new ForbiddenException('Project not found');

    return this.prisma.sprint.create({
      data: {
        name: data.name,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        projectId: data.projectId,
      }
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sprint details' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    const sprint = await this.prisma.sprint.findUnique({
      where: { id },
      include: {
        project: { include: { client: true } },
        issues: true
      }
    });

    if (!sprint || sprint.project.client.organizationId !== req.user.organizationId) {
      throw new ForbiddenException('Access denied');
    }

    return sprint;
  }
}
