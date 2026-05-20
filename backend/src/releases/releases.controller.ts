import { Controller, Get, Post, Body, Param, UseGuards, Request, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateReleaseDto } from './dto/create-release.dto';

@ApiTags('releases')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('releases')
export class ReleasesController {
  constructor(private prisma: PrismaService) {}

  @Get('project/:projectId')
  async findByProject(@Param('projectId') projectId: string, @Request() req: any) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, client: { organizationId: req.user.organizationId } }
    });
    if (!project) throw new ForbiddenException('Project not found');

    return this.prisma.release.findMany({
      where: { projectId },
      orderBy: { version: 'desc' }
    });
  }

  @Post()
  async create(@Body() data: CreateReleaseDto, @Request() req: any) {
    const project = await this.prisma.project.findFirst({
      where: { id: data.projectId, client: { organizationId: req.user.organizationId } }
    });
    if (!project) throw new ForbiddenException('Project not found');

    return this.prisma.release.create({
      data: {
        version: data.version,
        name: data.name,
        releasedAt: data.releasedAt ? new Date(data.releasedAt) : null,
        projectId: data.projectId,
      }
    });
  }
}
