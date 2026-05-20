import { Controller, Get, Post, Body, Param, UseGuards, Request, ForbiddenException, NotFoundException, Put, Delete } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateProjectDto } from './dto/create-project.dto';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('projects')
export class ProjectsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List all projects for the organization' })
  async findAll(@Request() req: any) {
    return this.prisma.project.findMany({
      where: {
        client: {
          organizationId: req.user.organizationId
        }
      },
      include: {
        client: true,
        clientApp: true,
        team: true
      }
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  async create(@Body() data: CreateProjectDto, @Request() req: any) {
    // Verify client belongs to organization
    const client = await this.prisma.client.findFirst({
      where: { id: data.clientId, organizationId: req.user.organizationId }
    });
    if (!client) throw new ForbiddenException('Client not found in your organization');

    return this.prisma.project.create({
      data: {
        ...data,
      }
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project details' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        client: true,
        clientApp: true,
        team: true,
        issues: true,
        sprints: true,
        releases: true
      }
    });

    if (!project) throw new NotFoundException();
    if (project.client.organizationId !== req.user.organizationId) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return project;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update project' })
  async update(@Param('id') id: string, @Body() data: any, @Request() req: any) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { client: true }
    });

    if (!project) throw new NotFoundException();
    if (project.client.organizationId !== req.user.organizationId) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return this.prisma.project.update({
      where: { id },
      data
    });
  }
}
